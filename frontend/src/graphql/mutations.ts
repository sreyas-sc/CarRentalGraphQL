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
