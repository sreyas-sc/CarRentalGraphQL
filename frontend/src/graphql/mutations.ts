import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $phone: String, $city: String, $state: String, $country: String) {
    register(name: $name, email: $email, password: $password, phone: $phone, city: $city, state: $state, country: $country) {
      id
      name
      email
    }
  }
`;


export const ADD_RENTABLE_VEHICLE_MUTATION = gql`
    mutation AddRentableVehicle(
        $make: String!
        $model: String!
        $year: String!
        $price: Float!
        $quantity: Int!
        $description: String
        $primaryImage: Upload
        $additionalImages: [Upload]
    ) {
        addRentableVehicle(
            input:{
              make: $make
              model: $model
              year: $year
              price: $price
              quantity: $quantity
              description: $description
              
            }
            primaryImage: $primaryImage
            additionalImages: $additionalImages
        ) {
            id
            make
            model
            year
            price
            quantity
            description
            primaryImageUrl
            additionalImageUrls
        }
    }
`;


export const ADD_VEHICLE_MUTATION = gql`
  mutation AddVehicle($make: String!, $model: String!, $year: String!) {
    addVehicle(make: $make, model: $model, year: $year) {
      id
      make
      model
      year
    }
  }
`;


export const UPDATE_RENTABLE_VEHICLE = gql`
  mutation updateRentableVehicle(
      $id: ID
      $make: String!
      $model: String!
      $year: String!
      $price: Float!
      $quantity: Int!
      $description: String
      $primaryImage: Upload
      $additionalImages: [Upload]
  ) {
    updateRentableVehicle(
      id: $id,
      make: $make,
      model: $model,
      year: $year,
      price: $price,
      quantity: $quantity,
      description: $description,
      primaryImage: $primaryImage
      additionalImages: $additionalImages
    ) {
      
      make
      model
      year
      price
      quantity
      description
      primaryImageUrl
      additionalImageUrls
    }
  }
`;


export const GET_ALL_VEHICLES_MUTATION = gql`
  query GetAllVehicles {
    getAllCars {
      id
      make
      model
      year
    }
  }
`;

export const GET_RENTABLE_VEHICLES = gql`
  query {
    getRentableVehicles {
      id
      make
      model
      year
      price
      quantity
      primaryImageUrl
      description
    }
  }
`;

export const DELETE_RENTABLE_VEHICLE = gql`
  mutation DeleteRentableVehicle($id: String!) {
    deleteRentableVehicle(id: $id) {
      success
      message
    }
  }
`;

export const GET_ALL_MAKES = gql`
  query GetAllMakes {
    getAllMakes
  }
`;

export const GET_MODELS_BY_MAKE = gql`
  query GetModelsByMake($make: String!) {
    getModelsByMake(make: $make) {
      model
      year
    }
  }
`;
