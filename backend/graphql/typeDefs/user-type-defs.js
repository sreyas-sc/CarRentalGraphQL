// These files define the structure of your GraphQL API, such as the queries, mutations, and the types of data you can query.
// user-type-defs.js: Defines the user schema for GraphQL, detailing fields for the user entity and user-related queries or mutations.
import { gql } from 'apollo-server-express';

const userTypeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        password: String! # Consider removing this for security reasons
        phone: String!
        city: String!
        country: String!
        state: String!
    }

    type LoginResponse {  # New type for login response
        token: String!
        user: User
    }

    type Query {
        getAllUsers: [User!]!
        login(email: String!, password: String!): LoginResponse!  # Updated return type
    }

    type Mutation {
        register(name: String!, email: String!, password: String!, phone: String, city: String, country: String, state: String): User!
        login(email: String!, password: String!): LoginResponse!  
    }
`;

export default userTypeDefs; // Don't forget to export the type definitions
