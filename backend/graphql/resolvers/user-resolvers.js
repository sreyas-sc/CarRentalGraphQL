// These files contain the logic for handling GraphQL queries and mutations. Resolvers fetch data based on the defined schema.
// user-resolvers.js: Handles user-specific operations like user registration, login, and profile management.

import bcrypt from 'bcrypt'; // Import bcrypt for hashing passwords
import User from '../../models/user-model.js';
import { createToken } from '../../utils/createToken.js'; 

const userResolvers = {
    Query: {
        getAllUsers: async () => {
            return await User.findAll();
        },
    },
    Mutation: {
        register: async (_, { name, email, password, phone, city, country, state }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await User.create({ 
                name, 
                email, 
                password: hashedPassword,
                phone, 
                city, 
                country, 
                state 
            });
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw new Error('User not found');  // Throw an error instead of returning null
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                throw new Error('Password does not match');  // Throw an error instead of returning null
            }

            const token = createToken(user.id);
            return { token, user };  // Return both token and user information
        }
    },
};

export default userResolvers;
