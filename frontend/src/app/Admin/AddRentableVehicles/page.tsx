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
  const [quantity, setQuantity] = useState<number>(1);

  // States for primary and additional images
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  const [getMakes] = useLazyQuery(GET_ALL_MAKES, {
    onCompleted: (data) => setMakes(data.getAllMakes),
  });

  const [getModels] = useLazyQuery(GET_MODELS_BY_MAKE, {
    variables: { make: selectedMake },
    onCompleted: (data) => setModels(data.getModelsByMake),
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

  // Handle adding vehicle
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVehicle({
        variables: {
          make: selectedMake,
          model: selectedModel,
          year: selectedYear,
          // Image upload handling can be integrated here
        },
      });
      alert('Vehicle added successfully!');
      // Reset form fields
      setSelectedMake('');
      setSelectedModel('');
      setSelectedYear('');
      setPrimaryImage(null);
      setAdditionalImages([]);
    } catch (err) {
      console.error(err);
      alert('Failed to add vehicle');
    }
  };

  // Handle file change for primary image
  const handlePrimaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPrimaryImage(e.target.files[0]);
    }
  };

  // Handle adding additional images
  const handleAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const updatedImages = [...additionalImages];
      updatedImages[index] = e.target.files[0];
      setAdditionalImages(updatedImages);
    }
  };

  // Handle adding new image input field
  const handleAddImageField = () => {
    setAdditionalImages([...additionalImages, new File([], '')]);
  };


  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + amount))); // Keep between 1 and 10
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Add Rentable Cars</h1>
      <form className={styles.form} onSubmit={handleAddVehicle}>
        {/* Vehicle Make Dropdown */}
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

        {/* Model Dropdown */}
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

        {/* Year Dropdown */}
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

        {/* Description Textarea */}
        <div>
          <textarea placeholder='Description' className={styles.description} />
        </div>

        {/* Price Input */}
        <div className={styles.priceContainer}>
          <span className={styles.currencySymbol}>₹</span>
          <input type="number" name="price" placeholder='Price' className={styles.price} />
        </div>

        {/* Quantity Input */}
        <label>Quantity</label>

        {/* Quantity Selector */}
        <div className={styles.quantityContainer}>
          <button
            type="button"
            className={styles.quantityButtonMinus}
            onClick={() => handleQuantityChange(-1)}
          >
            -
          </button>
          <input
            type="text"
            value={quantity}
            readOnly
            className={styles.quantityDisplay}
          />
          <button
            type="button"
            className={styles.quantityButton}
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>


        {/* Primary Image Picker */}
        <label>Primary Image:</label>
        <div className={styles.imagePicker}>
          <input type="file" accept="image/*" onChange={handlePrimaryImageChange} />
        </div>

        {/* Multiple Images Input */}
        <div className={styles.imagePicker}>
          <label>Additional Images:</label>
          {additionalImages.map((_, index) => (
            <div key={index}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAdditionalImageChange(e, index)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddImageField} className={styles.addImageButton}>
            Add More Images
          </button>
        </div>

        {/* Submit Button */}
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
