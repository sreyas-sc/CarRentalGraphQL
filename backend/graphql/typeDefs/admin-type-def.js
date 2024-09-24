// These files define the structure of your GraphQL API, such as the queries, mutations, and the types of data you can query.
// admin-type-def.js: Contains the GraphQL schema for the admin section (e.g., what fields an admin has, the available admin operations).
import { gql } from 'apollo-server-express'; // Importing gql

const adminTypeDefs = gql`
    type Admin {
        id: ID!
        email: String!
        password: String!
    }

    extend type Query {
        getAllAdmins: [Admin]
    }

    extend type Mutation {
        registerAdmin(email: String!, password: String!): Admin!
    }
`;

export default adminTypeDefs;
