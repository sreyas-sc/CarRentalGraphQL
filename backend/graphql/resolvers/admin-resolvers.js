// These files contain the logic for handling GraphQL queries and mutations. Resolvers fetch data based on the defined schema.
// admin-resolvers.js: Contains resolvers related to admin-specific operations (e.g., fetching admin data, performing admin tasks like user management).
 // Importing the Admin model
import bcrypt from 'bcrypt';
import { createToken } from '../../utils/createToken.js';
import Admin from '../../models/admin-model.js';


const adminResolvers = {
    Query: {
        getAllAdmins: async () => {
            return await Admin.findAll();
        },
    },

    Mutation: {
        registerAdmin: async (_, { email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await Admin.create({ 
                email, 
                password : hashedPassword,
            });
        },
    },
};

export default adminResolvers;
