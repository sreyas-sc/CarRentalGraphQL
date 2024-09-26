// import { gql } from 'apollo-server-express'; // Importing gql

// const adminTypeDefs = gql`
//     type Admin {
//         id: ID!
//         email: String!
//         password: String!
//     }

//     type AdminLoginResponse {
//         token: String!
//         user: Admin
//     }

//     type Vehicle {
//         id: ID!
//         make: String!
//         model: String!
//         year: String!
//     }

//     type ModelYear {
//         model: String!
//         year: String!
//     }

//     extend type Query {
//         getAllAdmins: [Admin]                
//         getAllVehicles: [Vehicle]            
//         loginAdmin(email: String!, password: String!): AdminLoginResponse! 
//         getAllMakes: [String!]               
//         getModelsByMake(make: String!): [ModelYear!]  
//         getVehicleByMakeAndModel(make: String!, model: String!): Vehicle  
//     }

//     extend type Mutation {
//         registerAdmin(email: String!, password: String!): Admin! 
//         loginAdmin(email: String!, password: String!): AdminLoginResponse! 
//         addVehicle(make: String!, model: String!, year: String!): Vehicle! 
//     }
// `;

// export default adminTypeDefs;

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

    type Vehicle {
        id: ID!
        make: String!
        model: String!
        year: String!
    }

    type RentableVehicle {
    id: ID!
    make: String!
    model: String!
    year: String!
    price: Float!
    quantity: Int!
    description: String!
    primaryImageUrl: String
    additionalImageUrls: [String]
    createdAt: String!  
    updatedAt: String!
}


    type ModelYear {
        model: String!
        year: String!
    }

    extend type Query {
        getAllAdmins: [Admin]                
        getAllVehicles: [Vehicle]            
        loginAdmin(email: String!, password: String!): AdminLoginResponse! 
        getAllMakes: [String!]               
        getModelsByMake(make: String!): [ModelYear!]  
        getVehicleByMakeAndModel(make: String!, model: String!): Vehicle  
    }

    extend type Mutation {
        registerAdmin(email: String!, password: String!): Admin! 
        loginAdmin(email: String!, password: String!): AdminLoginResponse! 
        addVehicle(make: String!, model: String!, year: String!): Vehicle! 
        addRentableVehicle(
            make: String!,  
            model: String!, 
            year: String!, 
            price: Float!, 
            quantity: Int!,
            description: String!, 
            primaryImageUrl: String, 
            additionalImageUrls: [String]
        ): RentableVehicle!  # Added return type
    }
`;

export default adminTypeDefs;
