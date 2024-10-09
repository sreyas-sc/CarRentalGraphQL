'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useQuery, useMutation } from '@apollo/client';
import { GET_VEHICLE_DETAILS_BY_ID, ADD_BOOKING_MUTATION } from '@/graphql/mutations'; 
import styles from './book-car.module.css';
import Swal from 'sweetalert2';

// Define types for Vehicle and User
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  price: number;
  description: string;
  primaryImageUrl?: string;
}

interface User {
  id: string,
  phone: string;
  email: string;
  name: string;
}

interface VehicleData {
  getVehicleDetailsById: Vehicle;
}

const Booking: React.FC = () => {
  const router = useRouter();
  
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const fromdate = params.get('fromdate');
    const todate = params.get('todate');
    const totalAmount = params.get('amount');

    setVehicleId(id);
    setFromDate(fromdate || '');
    setToDate(todate || '');
    setAmount(parseInt(totalAmount || '0'));

    // Parse user data from session storage
    const sessionUser: User = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (sessionUser) {
      setUser(sessionUser);
    }
  }, []);

  const { loading, error, data } = useQuery<VehicleData>(GET_VEHICLE_DETAILS_BY_ID, {
    variables: { id: vehicleId },
    skip: !vehicleId,
  });

  const [addBooking] = useMutation(ADD_BOOKING_MUTATION, {
    onCompleted: (data) => {
      Swal.fire({
        title: 'Booking Confirmed!',
        text: `You booked a ${data.addBooking.make} ${data.addBooking.model} from ${fromDate} to ${toDate}.`,
        icon: 'success',
      });
      router.push('/');
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
      });
    },
  });

  // Function to calculate total number of days
  const calculateTotalDays = () => {
    return Math.ceil((new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 3600 * 24));
  };

  const handleBooking = async () => {
    if (!user || !fromDate || !toDate || !vehicleId) {
      Swal.fire({
        title: 'Missing Information!',
        text: 'Please ensure all fields are filled out correctly.',
        icon: 'warning',
      });
      return;
    }

    try {
      await addBooking({
        variables: {
          vehicleId: parseInt(vehicleId), 
          userId: parseInt(user.id),
          startDate: fromDate.toString(),
          endDate: toDate.toString(),
          status: "booked",
          totalPrice: amount.toString(),
        },        
      });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const totalDays = calculateTotalDays();

  return (
    <div className={styles.bookingContainer}>
      <h1 className={styles.title}>Booking Details</h1>
      <div className={styles.vehicleDetails}>
        <img
          src={data?.getVehicleDetailsById?.primaryImageUrl || 'https://via.placeholder.com/300'}
          alt={`${data?.getVehicleDetailsById?.make} ${data?.getVehicleDetailsById?.model}`}
          className={styles.vehicleImage}
        />
        <h2 className={styles.vehicleName}>{data?.getVehicleDetailsById?.make} {data?.getVehicleDetailsById?.model} ({data?.getVehicleDetailsById?.year})</h2>
        <p className={styles.description}><strong>Price:</strong> ₹{data?.getVehicleDetailsById?.price}/day</p>
        <p className={styles.description}>{data?.getVehicleDetailsById?.description}</p>
      </div>
      <div className={styles.detailsContaineSub}>
      <div className={styles.priceSummary}>
        <p><strong>Pickup Dtae:</strong> {fromDate}</p>
        <p><strong>Drop Off Date:</strong> {toDate}</p>
      </div>
      <div className={styles.priceSummary2}>
        <p><strong>Total Days:</strong> {totalDays}</p>
      </div>
      <div className={styles.priceSummary3}>
      <p><strong>Total Price:</strong> ₹{amount}</p>
      </div>
      </div>
      
      <button onClick={handleBooking} className={styles.bookButton}>Book Now</button>
    </div>
  );
};

export default Booking;
