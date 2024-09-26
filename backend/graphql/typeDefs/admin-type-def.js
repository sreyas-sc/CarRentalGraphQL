import { gql } from 'apollo-server-express'; // Importing gql

const adminTypeDefs = gql`
    type Admin {
        id: ID!
        email: String!
        password: String!
    }

    type AdminLoginResponse {
        token: String!
        user: Admin
    }

    extend type Query {
        getAllAdmins: [Admin]
        loginAdmin(email: String!, password: String!): AdminLoginResponse!
    }

    extend type Mutation {
        registerAdmin(email: String!, password: String!): Admin!
        loginAdmin(email: String!, password: String!): AdminLoginResponse!
        addVehicle(make: String!, model: String!, year: String!): Vehicle!
    }

    type Vehicle {
        id: ID!
        make: String!
        model: String!
        year: String!
    }
`;

export default adminTypeDefs;
