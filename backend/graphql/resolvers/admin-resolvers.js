import bcrypt from 'bcrypt';
import { createToken } from '../../utils/createToken.js';
import Admin from '../../models/admin-model.js';
import Vehicle from '../../models/vehicle-model.js';
import RentableVehicle from '../../models/rentable-vehicle-model.js';
import sequelize from '../../models/db.js';
import minioClient from '../../config/minioClient.js';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import path from 'path';
import Booking from '../../models/booking-model.js';
import { GraphQLUpload } from 'graphql-upload';
import { Op } from 'sequelize';
import User  from '../../models/user-model.js';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';


dotenv.config();


const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
  });


// Workaround to get __dirname in ESM
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadToMinio = async (filePath, fileName) => {
    const bucketName = 'your-bucket-name';
    const objectName = `${Date.now()}-${fileName}`;

    // Upload the file buffer to MinIO
    await minioClient.putObject(bucketName, objectName, fs.createReadStream(filePath));
    return await minioClient.presignedGetObject(bucketName, objectName);
};

const adminResolvers = {
    Upload: GraphQLUpload,
    Query: {
        getAllAdmins: async () => {
            return await Admin.findAll();
        },

        getAllCars: async () => {
            return await Vehicle.findAll({
                attributes: ['id', 'make', 'model', 'year', 'createdAt', 'updatedAt'],
            });
        },

        // Get all makes( distinct for avoiding duplication)
        getAllMakes: async () => {
            return await Vehicle.findAll({
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('make')), 'make']],
                raw: true,
            }).then(results => results.map(result => result.make));
        },

        // Query to get the model of the  vehicle with the provided make
        getModelsByMake: async (_, { make }) => {
            return await Vehicle.findAll({ 
                attributes: ['model', 'year'], 
                where: { make } 
            });
        },

        // Query to get the year by vehicle make and year( for filling the dropdown in add rentable vehicles)
        getVehicleByMakeAndModel: async (_, { make, model }) => {
            const vehicle = await Vehicle.findOne({ where: { make, model } });
            if (!vehicle) {
                throw new Error('Vehicle not found');
            }
            return vehicle;
        },

        // Query get all the vehicles that are rentble(for admin view and user view)
        getRentableVehicles: async () => {
            try {
                const vehicles = await RentableVehicle.findAll(); // Correct usage of Sequelize
                return vehicles;
            } catch (error) {
                throw new Error('Failed to fetch rentable vehicles: ' + error.message);
            }
        },    
          
        async getAvailableCars(_, { startdate, enddate }) {
            console.log("!!!!!!!!!!!!!!!!!!");
            console.log("Requested Date Range:", startdate, enddate);
            try {
              // Step 1: Fetch all cars from the RentableVehicle model
              const allCars = await RentableVehicle.findAll();
          
              // Step 2: Fetch bookings that overlap with the requested date range
              const overlappingBookings = await Booking.findAll({
                where: {
                  [Op.or]: [
                    {
                      startDate: {
                        [Op.lte]: enddate,
                      },
                      endDate: {
                        [Op.gte]: startdate,
                      },
                    },
                    {
                      startDate: {
                        [Op.gte]: startdate,
                      },
                      endDate: {
                        [Op.lte]: enddate,
                      },
                    },
                  ],
                },
              });
          
              // Step 3: Create a set of unavailable vehicle IDs
              const unavailableVehicleIds = new Set(overlappingBookings.map(booking => booking.vehicleId));
          
              // Step 4: Filter available vehicles
              const availableCars = allCars.filter(vehicle => !unavailableVehicleIds.has(vehicle.id));
          
              // Log available cars
              console.log("Available Cars:", availableCars);
          
              // Step 5: Return the list of available cars
              console.log("These are the available cars~~~~~~~~~~~~~~~~~~~~~~~", availableCars)
              return availableCars;
              
            } catch (error) {
              console.error('Error fetching available cars:', error);
              throw new Error('Error fetching available cars.');
            }
          },
          
        
        // Query to get the vehicle details by the id of the vehicle
        getVehicleDetailsById: async (_, { id }) => {
            return await RentableVehicle.findOne({  // Use findOne to get a single record
                attributes: ['make', 'model', 'year', 'price', 'quantity', 'availability', 'transmission', 'fuel_type', 'seats', 'description', 'primaryImageUrl', 'additionalImageUrls'],
                where: { id }
            });
        },

        getAllBookings: async () => {
            try {
              const bookings = await Booking.findAll({
                include: [
                  {
                    model: User,
                    as: 'user',
                  },
                  {
                    model: Vehicle,
                    as: 'vehicle',
                  },
                ],
              });
              console.log('Fetched bookings:', bookings);
              return bookings;
            } catch (error) {
              console.error(error); // Log the error for better debugging
              throw new Error(`Failed to fetch bookings: ${error.message}`);
            }
          },
          

          getBookingsByUserId: async (_, { userId }) => {
            try {
              // Fetch bookings for the specified userId
              const bookings = await Booking.findAll({ where: { userId } });
      
              // Map over the bookings to fetch user and vehicle details
              const bookingsWithDetails = await Promise.all(
                bookings.map(async (booking) => {
                  const user = await User.findByPk(booking.userId); // Assuming you have a User model
                  const vehicle = await Vehicle.findByPk(booking.vehicleId); // Assuming you have a Vehicle model
      
                  return {
                    ...booking.dataValues, // Spread existing booking properties
                    user, // Include user details
                    vehicle, // Include vehicle details
                  };
                })
              );
      
              return bookingsWithDetails;
            } catch (error) {
              throw new Error('Failed to fetch bookings: ' + error.message);
            }
          },
    },


    
      

    // ***************************Mutations********************
    Mutation: {

        // mutation for admin registration(used to add admin via thunderclient)
        registerAdmin: async (_, { email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await Admin.create({ email, password: hashedPassword });
        },

        // mutation to add the vechile make, model and year
        addVehicle: async (_, { make, model, year }) => {
            return await Vehicle.create({ make, model, year });
        },


        createRazorpayOrder: async (_, { input }) => {
            const { amount, currency } = input;

            try {
                // Create an order in Razorpay
                const order = await razorpay.orders.create({
                    amount: amount, // Amount in paisa
                    currency: currency,
                    receipt: `receipt_order_${new Date().getTime()}`, // unique receipt ID
                });

                // Return the created order
                return {
                    id: order.id,
                    amount: order.amount,
                    currency: order.currency,
                };
            } catch (error) {
                console.error('Error creating Razorpay order:', error);
                throw new Error('Failed to create Razorpay order');
            }
        },

        // addBooking: async (_, { input }) => {
        //     try {
        //         console.log("Received booking input:", JSON.stringify(input, null, 2)); // Log the input
                
        //         // Validate input structure
        //         const { vehicleId, userId, startDate, endDate, status, totalPrice } = input;
        //         if (!vehicleId || !userId || !startDate || !endDate || !status || !totalPrice) {
        //             throw new Error("Missing required fields");
        //         }
        
        //         // Create the booking record in the database
        //         const booking = await Booking.create({
        //             vehicleId: vehicleId,
        //             userId: userId,
        //             startDate: startDate,
        //             endDate: endDate,
        //             status: status,
        //             totalPrice: totalPrice
        //           });
                                
        //         console.log("Booking created:", booking); // Log the created booking
                
        //         return booking; // Return the created booking
        //     } catch (error) {
        //         console.error('Error adding booking:', error); // Log any errors
        //         throw new Error(`Failed to add booking: ${error.message}`);
        //     }
        // },

        addBooking: async (_, { input }) => {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111133",input)
            console.log("Received booking input:", JSON.stringify(input, null, 2));
            try {
              const { 
                vehicleId, 
                userId, 
                startDate, 
                endDate, 
                status, 
                totalPrice, 
                razorpayPaymentId, 
                razorpayOrderId, 
                razorpaySignature 
              } = input;
      
              // Validate input
              if (!vehicleId || !userId || !startDate || !endDate || !status || !totalPrice || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
                throw new Error("Missing required fields");
              }
      
              // Verify Razorpay payment
              const generatedSignature = crypto
                .createHmac('sha256', process.env.KEY_SECRET)
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest('hex');
      
              if (generatedSignature !== razorpaySignature) {
                throw new Error('Invalid payment signature');
              }
      
              // Fetch payment details from Razorpay
              const payment = await razorpay.payments.fetch(razorpayPaymentId);
      
              // Verify payment amount and status
              if (payment.status !== 'captured' || payment.amount !== parseFloat(totalPrice) * 100) {
                throw new Error('Payment verification failed');
              }
      
              // Check if the vehicle is still available for the selected dates
            //   const overlappingBookings = await Booking.findAll({
            //     where: {
            //       vehicleId,
            //       [Op.or]: [
            //         {
            //           startDate: { [Op.lte]: endDate },
            //           endDate: { [Op.gte]: startDate }
            //         },
            //         {
            //           startDate: { [Op.between]: [startDate, endDate] }
            //         },
            //         {
            //           endDate: { [Op.between]: [startDate, endDate] }
            //         }
            //       ]
            //     }
            //   });
      
            //   if (overlappingBookings.length > 0) {
            //     throw new Error('Vehicle is no longer available for the selected dates');
            //   }
      
              // Create the booking record in the database
              const booking = await Booking.create({
                vehicleId,
                userId,
                startDate,
                endDate,
                status,
                totalPrice,
                paymentId: razorpayPaymentId,
                orderId: razorpayOrderId
              });
      
              console.log("Booking created:", booking);
              
              return booking;
            } catch (error) {
              console.error('Error adding booking:', error);
              throw new Error(`Failed to add booking: ${error.message}`);
            }
          },
        
     
        addRentableVehicle: async (_, { input, primaryImage, additionalImages }) => {
            try {
                const { make, model, year, price, quantity, availability, transmission, fuel_type, seats, description } = input;
        
                // Log the input object
                console.log("Input is:", JSON.stringify(input, null, 2));
        
                const bucketName = "carrental";
                const bucketExists = await minioClient.bucketExists(bucketName);
                if (!bucketExists) {
                    throw new Error(`Bucket ${bucketName} does not exist.`);
                }
        
                // Ensure uploads directory exists
                const uploadsDir = path.join(__dirname, '..', 'uploads');
                if (!existsSync(uploadsDir)) {
                    mkdirSync(uploadsDir, { recursive: true });
                }
        
                const uploadFile = async (file) => {
                    const { createReadStream, filename } = await file;
                    const filePath = path.join(uploadsDir, filename); 
                    const stream = createReadStream();
                    const writeStream = createWriteStream(filePath);
                    stream.pipe(writeStream);
        
                    return await uploadToMinio(filePath, filename); // Upload to MinIO
                };
        
                // Check if primary image is provided and upload it
                let uploadedPrimaryImageUrl = '';
                if (primaryImage) {
                    uploadedPrimaryImageUrl = await uploadFile(primaryImage);
                }
        
                // Upload additional images only if they are provided
                let uploadedAdditionalImageUrls = [];
                if (additionalImages && additionalImages.length > 0) {
                    uploadedAdditionalImageUrls = await Promise.all(
                        additionalImages.map((image) => uploadFile(image))
                    );
                }
        
                const vehicle = await RentableVehicle.create({
                    make,
                    model,
                    year,
                    price,
                    quantity,
                    availability,
                    description,
                    transmission,
                    fuel_type,
                    seats,
                    primaryImageUrl: uploadedPrimaryImageUrl,
                    additionalImageUrls: uploadedAdditionalImageUrls,
                });
        
                return vehicle; // Consider returning a simplified object if necessary
            } catch (error) {
                console.error('Error adding rentable vehicle:', error); // Log the full error object
                throw new Error(`Failed to add rentable vehicle: ${error.message}`);
            }
        },
        


        // Mutation to delete the vehicles that the users can rent
        deleteRentableVehicle: async (_, { id }) => {
            try {
                const result = await RentableVehicle.destroy({
                    where: { id }  // Specify the ID of the vehicle to delete
                });
        
                if (!result) {
                    return { success: false, message: "Vehicle not found." };
                }
                return { success: true, message: "Vehicle deleted successfully." };
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                return { success: false, message: "Failed to delete vehicle." };
            }
        },

        updateRentableVehicle: async (
            _,
            { id, make, model, year, price, quantity, description, primaryImage, additionalImages }
        ) => {
            try {
                // Find the vehicle by ID
                const vehicle = await RentableVehicle.findByPk(id);
                if (!vehicle) throw new Error('Vehicle not found.');
        
                // Prepare the input object for updates
                const input = { make, model, year, price, quantity, description };
                if (make !== undefined) input.make = make;
        
                // If images are provided, upload them to MinIO
                const uploadsDir = path.join(__dirname, '..', 'uploads');
                if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
        
                const uploadFile = async (file) => {
                    const { createReadStream, filename } = await file;
                    const filePath = path.join(uploadsDir, filename);
                    const stream = createReadStream();
                    const writeStream = createWriteStream(filePath);
                    stream.pipe(writeStream);
        
                    return await uploadToMinio(filePath, filename);
                };
        
                // Upload primary image if provided
                if (primaryImage) {
                    const uploadedPrimaryImageUrl = await uploadFile(primaryImage);
                    input.primaryImageUrl = uploadedPrimaryImageUrl;
                }
        
                // Upload additional images if provided
                if (additionalImages && additionalImages.length > 0) {
                    const uploadedAdditionalImageUrls = await Promise.all(
                        additionalImages.map((image) => uploadFile(image))
                    );
                    input.additionalImageUrls = uploadedAdditionalImageUrls;
                }
        
                // Update vehicle details
                await vehicle.update(input);
        
                // Fetch the updated vehicle data
                const updatedVehicle = await RentableVehicle.findByPk(id);
                if (!updatedVehicle) throw new Error('Updated vehicle not found.');
        
                // Return the updated vehicle with success message
                return {
                    success: true,
                    message: "Vehicle updated successfully.",
                    vehicle: updatedVehicle, // Ensure this is valid and non-null
                };
            } catch (error) {
                console.error('Error updating vehicle:', error);
                return {
                    success: false,
                    message: `Failed to update vehicle: ${error.message}`,
                    vehicle: null, // Explicitly return null to avoid non-nullable error
                };
            }
        },
        

        
        
        loginAdmin: async (_, { email, password }) => {
            const admin = await Admin.findOne({ where: { email } });

            if (!admin) {
                throw new Error('Admin not found');
            }

            const isMatch = await bcrypt.compare(password, admin.password);

            if (!isMatch) {
                throw new Error('Password does not match');
            }

            const token = createToken(admin.id);
            return { token, user: admin }; // Return both token and user information
        }
    },
};

export default adminResolvers;



