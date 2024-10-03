'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation
import { useQuery } from '@apollo/client';
import { GET_VEHICLE_DETAILS_BY_ID } from '@/graphql/mutations'; // Import the query to fetch vehicle details
import styles from './book-car.module.css';
import Swal from 'sweetalert2';

const Booking: React.FC = () => {
  const router = useRouter();
  
  // Using URLSearchParams to retrieve the vehicleId from the URL
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setVehicleId(id); // Set the vehicleId state
  }, []);

  const { loading, error, data } = useQuery(GET_VEHICLE_DETAILS_BY_ID, {
    variables: { id: vehicleId },
    skip: !vehicleId, // Skip query if vehicleId is not available
  });

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const calculateTotalPrice = () => {
    const totalDays = Math.ceil((new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 3600 * 24));
    const pricePerDay = data?.getVehicleDetailsById?.price || 0; // Ensure the field name is correct
    return totalDays > 0 ? totalDays * pricePerDay : 0; // Only calculate if totalDays > 0
  };

  const handleBooking = () => {
    const totalPrice = calculateTotalPrice();

    Swal.fire({
      title: 'Booking Confirmed!',
      text: `You booked a ${data?.getVehicleDetailsById?.make} ${data?.getVehicleDetailsById?.model} for ${Math.ceil((new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 3600 * 24))} days at ₹${totalPrice}.`,
      icon: 'success',
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const totalPrice = calculateTotalPrice(); // Calculate total price to display

  return (
    <div className={styles.bookingContainer}>
      <h1 className={styles.title}>Booking Details</h1>
      <div className={styles.vehicleDetails}>
        <img
          src={data?.getVehicleDetailsById?.primaryImageUrl || 'https://via.placeholder.com/300'}
          alt={`${data?.getVehicleDetailsById?.make} ${data?.getVehicleDetailsById?.model}`} // Corrected field name
          className={styles.vehicleImage}
        />
        <h2 className={styles.vehicleName}>{data?.getVehicleDetailsById?.make} {data?.getVehicleDetailsById?.model} ({data?.getVehicleDetailsById?.year})</h2>
        <p className={styles.description}><strong>Price:</strong> ₹{data?.getVehicleDetailsById?.price}/day</p>
        <p className={styles.description}>{data?.getVehicleDetailsById?.description}</p>
      </div>
      <div className={styles.dateSelection}>
        <label className={styles.label} htmlFor="fromDate">From:</label>
        <input 
          type="date" 
          id="fromDate" 
          className={styles.dateInput} 
          value={fromDate} 
          onChange={(e) => setFromDate(e.target.value)} 
        />
        
        <label className={styles.label} htmlFor="toDate">To:</label>
        <input 
          type="date" 
          id="toDate" 
          className={styles.dateInput} 
          value={toDate} 
          onChange={(e) => setToDate(e.target.value)} 
        />
      </div>
      {fromDate && toDate && (
        <div className={styles.priceSummary}>
          <p>Total Days: {Math.ceil((new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 3600 * 24))}</p>
          <p>Total Price: ₹{totalPrice}</p>
        </div>
      )}
      <button onClick={handleBooking} className={styles.bookButton}>Book Now</button>
    </div>
  );
};

export default Booking;
