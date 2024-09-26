'use client'
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../DashBoard/page';
import styles from './add-rentable-vehicles.module.css';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ADD_VEHICLE_MUTATION, GET_ALL_MAKES, GET_MODELS_BY_MAKE } from '@/graphql/mutations';

const AddRentableVehicles = () => {
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<{ model: string; year: string }[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const [getMakes, { loading: loadingMakes, error: errorMakes }] = useLazyQuery(GET_ALL_MAKES, {
    onCompleted: (data) => {
      console.log('Fetched Makes:', data.getAllMakes);
      setMakes(data.getAllMakes);
    }
  });

  const [getModels, { loading: loadingModels, error: errorModels }] = useLazyQuery(GET_MODELS_BY_MAKE, {
    variables: { make: selectedMake },
    onCompleted: (data) => {
      console.log('Fetched Models for Make:', selectedMake, data.getModelsByMake);
      setModels(data.getModelsByMake);
    }
  });

  const [addVehicle] = useMutation(ADD_VEHICLE_MUTATION);

  useEffect(() => {
    getMakes();
  }, [getMakes]);

  useEffect(() => {
    if (selectedMake) {
      getModels();
    }
  }, [selectedMake, getModels]);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVehicle({
        variables: {
          make: selectedMake,
          model: selectedModel,
          year: selectedYear,
        },
      });
      alert('Vehicle added successfully!');
      // Reset form fields
      setSelectedMake('');
      setSelectedModel('');
      setSelectedYear('');
    } catch (err) {
      console.error(err);
      alert('Failed to add vehicle');
    }
  };

  // Log loading states and errors
  useEffect(() => {
    if (loadingMakes) console.log('Loading Makes...');
    if (errorMakes) console.error('Error fetching Makes:', errorMakes);
    if (loadingModels) console.log('Loading Models...');
    if (errorModels) console.error('Error fetching Models:', errorModels);
  }, [loadingMakes, errorMakes, loadingModels, errorModels]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Add Rentable Cars</h1>
      <form className={styles.form} onSubmit={handleAddVehicle}>
        <div>
          <select
            name="vehicleMake"
            className={styles.inputfields}
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
          >
            <option value="" disabled>Select Make</option>
            {makes.map((make, index) => (
              <option key={index} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>
        {/* Model dropdown */}
        <div>
          <select
            name="vehicleModel"
            className={styles.inputfields}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedMake}
          >
            <option value="" disabled>Select Model</option>
            {models.map((modelYear, index) => (
              <option key={index} value={modelYear.model}>
                {modelYear.model}
              </option>
            ))}
          </select>
        </div>
        {/* Year dropdown */}
        <div>
          <select
            name="vehicleYear"
            className={styles.inputfields}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={!selectedModel}
          >
            <option value="" disabled>Select Year</option>
            {models
              .filter(modelYear => modelYear.model === selectedModel)
              .map((modelYear, index) => (
                <option key={index} value={modelYear.year}>
                  {modelYear.year}
                </option>
              ))}
          </select>
        </div>
        {/* Description textarea */}
        <div>
            <textarea placeholder='Description' className={styles.description} />
        </div>
        <div className={styles.priceContainer}>
          <span className={styles.currencySymbol}>₹</span>
          <input
            type="number"
            name="price"
            placeholder='Price'
            className={styles.price}
          />
        </div>
        <input placeholder='Quantity' type='number' max={10} className={styles.quantity} />


        <button type="submit" className={styles.submitbutton}>Add Car</button>
      </form>
    </div>
  );
};

const AddRentableVehiclePage = () => {
  return (
    <DashboardLayout>
      <AddRentableVehicles />
    </DashboardLayout>
  );
};

export default AddRentableVehiclePage;
