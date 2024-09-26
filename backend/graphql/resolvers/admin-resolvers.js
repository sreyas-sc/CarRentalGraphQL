// These files contain the logic for handling GraphQL queries and mutations. Resolvers fetch data based on the defined schema.
// admin-resolvers.js: Contains resolvers related to admin-specific operations (e.g., fetching admin data, performing admin tasks like user management).
 // Importing the Admin model
import bcrypt from 'bcrypt';
import { createToken } from '../../utils/createToken.js';
import Admin from '../../models/admin-model.js';
import Vehicle from '../../models/vehicle-model.js';
import RentableVehicle from '../../models/rentable-vehicle-model.js';
// import { sequelize } from '../../config/database.js'; 
import sequelize from '../../models/db.js';

const adminResolvers = {
    Query: {

        // Get the admin details
        getAllAdmins: async () => {
            return await Admin.findAll();
        },

        // get all the vehicle makes(brands)
        getAllMakes: async () => {
            // Fetch distinct makes from the Vehicle model
            return await Vehicle.findAll({
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('make')), 'make']],
                raw: true,  // To get raw results without instance methods
            }).then(results => results.map(result => result.make)); // Extracting makes
        },

        // Get all the models of the selected make
        getModelsByMake: async (_, { make }) => {
            // Fetch models based on the selected make
            return await Vehicle.findAll({ 
                attributes: ['model', 'year'], 
                where: { make } 
            });
        },

        // New Query: Get Vehicle by Make and Model
        getVehicleByMakeAndModel: async (_, { make, model }) => {
            // Fetch a vehicle that matches the given make and model
            const vehicle = await Vehicle.findOne({ 
                where: { make, model } 
            });
            if (!vehicle) {
                throw new Error('Vehicle not found'); // Handle case where no vehicle is found
            }
            return vehicle; // Return the vehicle details
        },

    },

    Mutation: {

        // Admin Registration
        registerAdmin: async (_, { email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await Admin.create({ 
                email, 
                password : hashedPassword,
            });
        },

        addVehicle: async (_, { make, model, year }) => {
            return await Vehicle.create({ 
                make, 
                model,
                year
            });
        },

        addRentableVehicle: async (_, { make, model, year, price, quantity, description, primaryImageUrl, additionalImageUrls }) => {
            try {
                // Create the RentableVehicle
                const vehicle = await RentableVehicle.create({
                    make,
                    model,
                    year,
                    price,
                    quantity,
                    description,
                    primaryImageUrl,
                    additionalImageUrls,
                });

                // Return the created vehicle details
                return {
                    id: vehicle.id,
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    price: vehicle.price,
                    quantity: vehicle.quantity,
                    description: vehicle.description,
                    primaryImageUrl: vehicle.primaryImageUrl,
                    additionalImageUrls: vehicle.additionalImageUrls,
                };
            } catch (error) {
                console.error('Error adding rentable vehicle:', error);
                throw new Error('Failed to add rentable vehicle'); // Handle the error appropriately
            }
        },

        // Admin Login
        loginAdmin: async (_, { email, password }) => {
            const admin = await Admin.findOne({ where: { email } });

            if (!admin) {
                throw new Error('Admin not found');  // Throw an error instead of returning null
            }

            const isMatch = await bcrypt.compare(password, admin.password);

            if (!isMatch) {
                throw new Error('Password does not match');  // Throw an error instead of returning null
            }

            const token = createToken(admin.id);
            return { token, user: admin }; // Return both token and user information
        }
    },
};

export default adminResolvers;
