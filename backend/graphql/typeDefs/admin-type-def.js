import { gql } from 'apollo-server-express';

const adminTypeDefs = gql`
    scalar Upload

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
        createdAt: String!
        updatedAt: String!
    }

    type RentableVehicle {
        id: ID!
        make: String!
        model: String!
        year: String!
        price: Float!
        quantity: Int!
        availability: Int!
        transmission: String!
        fuel_type: String!
        seats: Int!
        description: String
        primaryImageUrl: String
        additionalImageUrls: [String]
        createdAt: String!
        updatedAt: String!
    }

    type ModelYear {
        model: String!
        year: String!
    }

    type UpdateRentableVehicleResponse {
        success: Boolean!
        message: String!
        vehicle: RentableVehicle
    }

    type VehicleDetailsById {
        make: String!
        model: String!
        year: String!
        price: Float!
        quantity: Int!
        availability: Int!
        transmission: String!
        fuel_type: String!
        seats: Int!
        description: String
        primaryImageUrl: String
        additionalImageUrls: [String]
    }

    type Booking {
        id: ID!
        vehicleId: Int!
        userId: Int!
        startDate: String!
        endDate: String!
        status: String!
        totalPrice: String!
    }

    input vehicleInput {
        make: String!
        model: String!
        year: String!
        price: Float!
        quantity: Int!
        availability: Int!
        description: String
    }

    input updateVehicleInput {
        make: String!
        model: String
        year: String
        price: Float
        quantity: Int
        availability: Int
        description: String
    }

    input BookingInput {
        vehicleId: Int!
        userId: Int!
        startDate: String!
        endDate: String!
        status: String!
        totalPrice: String!
    }

    type AddBookingResponse {
        success: Boolean!
        message: String!
        booking: Booking
    }

    type DeleteResponse {
        success: Boolean!
        message: String!
    }

    type AvailableCar {
        id: ID!
        make: String!
        model: String!
        year: String!
        price: Float!
        availability: Int!
        transmission: String!
        fuel_type: String!
        seats: Int!
        description: String
        primaryImageUrl: String
        additionalImageUrls: [String]
    }

    extend type Query {
        getAllAdmins: [Admin]
        getAllVehicles: [Vehicle]
        loginAdmin(email: String!, password: String!): AdminLoginResponse!
        getAllMakes: [String!]
        getModelsByMake(make: String!): [ModelYear!]
        getVehicleByMakeAndModel(make: String!, model: String!): Vehicle
        getAllCars: [Vehicle!]!
        getRentableVehicles: [RentableVehicle!]!
        getVehicleDetailsById(id: ID!): VehicleDetailsById
        getBookings: [Booking]
        getAvailableCars(startdate: String!, enddate: String!): [AvailableCar]
    }

    extend type Mutation {
        registerAdmin(email: String!, password: String!): Admin!
        
        loginAdmin(email: String!, password: String!): AdminLoginResponse!
        
        addVehicle(make: String!, model: String!, year: String!): Vehicle!
        
        addRentableVehicle(
            input: vehicleInput!,
            primaryImage: Upload,
            additionalImages: [Upload]
        ): RentableVehicle!
        updateRentableVehicle(
            id: ID,
            make: String,
            model: String,
            year: String,
            price: Float,
            description: String,
            quantity: Int,
            availability: Int,
            primaryImage: Upload,
            additionalImages: [Upload]
        ): RentableVehicle
        deleteRentableVehicle(id: String!): DeleteResponse!
        addBooking(input: BookingInput!): Booking
    }
`;

export default adminTypeDefs;
