'use client'
import DashboardLayout from '../DashBoard/page';
import styles from './add-cars.module.css';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useMutation } from '@apollo/client';
import { ADD_VEHICLE_MUTATION } from '@/graphql/mutations'; // Assuming you have this mutation in your project

const vehicleMakes = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Nissan",
  "Hyundai",
  "Kia",
  "Volkswagen",
  "Subaru",
  "Mazda",
  "BMW",
  "Mercedes",
  "Suzuki",
  "Koenigsegg",
  "Lamborghini"
];

const AddVehicle = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [addVehicle] = useMutation(ADD_VEHICLE_MUTATION); // GraphQL mutation

  const handleMakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMake(value);

    // Filter suggestions based on user input
    if (value) {
      const filteredSuggestions = vehicleMakes.filter(make =>
        make.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMake(suggestion);
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVehicle({
        variables: {
          make,
          model,
          year,
        },
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Vehicle added successfully!',
        confirmButtonText: 'OK'
      });

      // Reset form fields
      setMake('');
      setModel('');
      setYear('');
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add vehicle',
        confirmButtonText: 'Try Again'
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Add Vehicle</h1>
      <form className={styles.form} onSubmit={handleAddVehicle}>
        <div>
          <input
            type="text"
            name="vehicleName"
            placeholder="Make"
            className={styles.inputfields}
            value={make}
            onChange={handleMakeChange}
          />
          {suggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={styles.suggestionItem}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <input
            type="text"
            name="vehicleModel"
            placeholder="Model"
            className={styles.inputfields}
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            name="vehicleYear"
            placeholder="Year"
            className={styles.inputfields}
            value={year}
            onChange={(e) => setYear(e.target.value)} // Set year as a string
          />
        </div>
        <button type="submit" className={styles.submitbutton}>Add Vehicle</button>
      </form>
    </div>
  );
};

const AddVehiclePage = () => {
  return (
    <DashboardLayout>
      <AddVehicle />
    </DashboardLayout>
  );
};

export default AddVehiclePage;
