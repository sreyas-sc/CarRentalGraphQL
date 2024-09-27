'use client';
import DashboardLayout from '../DashBoard/page';
import styles from './add-cars.module.css';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_VEHICLE_MUTATION } from '@/graphql/mutations';
import { GET_ALL_VEHICLES_MUTATION } from '@/graphql/mutations';

const vehicleMakes = [
  "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Hyundai",
  "Kia", "Volkswagen", "Subaru", "Mazda", "BMW", "Mercedes",
  "Suzuki", "Koenigsegg", "Lamborghini"
];

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
}

interface VehiclesData {
  getAllCars: Vehicle[];
}

const AddVehicle = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const { loading, error, data, refetch } = useQuery<VehiclesData>(GET_ALL_VEHICLES_MUTATION);
  const [addVehicle] = useMutation(ADD_VEHICLE_MUTATION);

  // Filter state
  const [filterMake, setFilterMake] = useState('');
  const [filterModel, setFilterModel] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const handleMakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMake(value);
    
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
    setSuggestions([]);
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVehicle({
        variables: { make, model, year },
        update: (cache, { data: { addVehicle } }) => {
          const cachedData = cache.readQuery<VehiclesData>({ query: GET_ALL_VEHICLES_MUTATION });
          if (cachedData) {
            const { getAllCars } = cachedData;
            cache.writeQuery({
              query: GET_ALL_VEHICLES_MUTATION,
              data: { getAllCars: [...getAllCars, addVehicle] },
            });
          }
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Vehicle added successfully!',
        confirmButtonText: 'OK'
      });

      setMake('');
      setModel('');
      setYear('');
      
      refetch();
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

  const filteredVehicles = data?.getAllCars.filter(vehicle => {
    return (
      (filterMake ? vehicle.make.toLowerCase().includes(filterMake.toLowerCase()) : true) &&
      (filterModel ? vehicle.model.toLowerCase().includes(filterModel.toLowerCase()) : true) &&
      (filterYear ? vehicle.year.includes(filterYear) : true)
    );
  });

  if (loading) return <p>Loading vehicles...</p>;
  if (error) return <p>Error loading vehicles: {error.message}</p>;

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
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.submitbutton}>Add Vehicle</button>
      </form>

      <h2 className={styles.header}>Vehicle List</h2>
      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="Filter by Make"
          value={filterMake}
          onChange={(e) => setFilterMake(e.target.value)}
          className={styles.filterfields}
        />
        <input
          type="text"
          placeholder="Filter by Model"
          value={filterModel}
          onChange={(e) => setFilterModel(e.target.value)}
          className={styles.filterfields}
        />
        <input
          type="text"
          placeholder="Filter by Year"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className={styles.filterfields}
        />
      </div>

      <table className={styles.vehicleTable}>
        <thead>
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles?.length ? (
            filteredVehicles.map((vehicle: Vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.make}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.year}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No vehicles found.</td>
            </tr>
          )}
        </tbody>
      </table>
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
