// index.js
// The entry point of your application. This file sets up the Express server, initializes Apollo Server for handling GraphQL requests, connects to the PostgreSQL database using Sequelize, and starts listening for requests on a specified port.
// import dotenv from 'dotenv'; // Import dotenv
// dotenv.config(); // Load environment variables
import dotenv from 'dotenv'; // Import dotenv
dotenv.config(); // Load environment variables

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import userTypeDefs from './graphql/typeDefs/user-type-defs.js';
import userResolvers from './graphql/resolvers/user-resolvers.js';
import adminTypeDefs from './graphql/typeDefs/admin-type-def.js'; // Import admin typeDefs
import adminResolvers from './graphql/resolvers/admin-resolvers.js'; // Import admin resolvers
import sequelize from './models/db.js'; // Change this line to use default import

const app = express();

// Combine type definitions and resolvers
const typeDefs = [userTypeDefs, adminTypeDefs];
const resolvers = [userResolvers, adminResolvers];

const server = new ApolloServer({ typeDefs, resolvers });

// Connect to the database
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');

        // Start the Apollo server
        await server.start();

        // Apply middleware after server has started
        server.applyMiddleware({ app });

        // Optional: Add middleware for body parsing
        app.use(express.json());

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () =>
            console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
        );
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

// Invoke the startServer function
startServer();
