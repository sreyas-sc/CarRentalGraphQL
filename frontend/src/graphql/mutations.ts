// // src/graphql/mutations.ts
// const REGISTER_MUTATION = `
//   mutation Register($name: String!, $email: String!, $password: String!, $phone: String, $city: String, $state: String, $country: String) {
//     register(name: $name, email: $email, password: $password, phone: $phone, city: $city, state: $state, country: $country) {
//       id
//       name
//       email
//     }
//   }
// `;

// export const registerUser = async (formData: any) => {
//     console.log("formdata is ",formData);

//   const response = await fetch('http://localhost:4000/graphql', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       query: REGISTER_MUTATION,
//       variables: formData
//     })
//   });

//   const result = await response.json();

//   if (result.errors) {
//     throw new Error(result.errors[0].message);
//   }

//   return result.data.register;
// };


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
