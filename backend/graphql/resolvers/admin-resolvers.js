// These files contain the logic for handling GraphQL queries and mutations. Resolvers fetch data based on the defined schema.
// admin-resolvers.js: Contains resolvers related to admin-specific operations (e.g., fetching admin data, performing admin tasks like user management).
 // Importing the Admin model
import bcrypt from 'bcrypt';
import { createToken } from '../../utils/createToken.js';
import Admin from '../../models/admin-model.js';
import Vehicle from '../../models/vehicle-model.js';


const adminResolvers = {
    Query: {
        getAllAdmins: async () => {
            return await Admin.findAll();
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
