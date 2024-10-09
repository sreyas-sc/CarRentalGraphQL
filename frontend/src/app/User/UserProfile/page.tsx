
'use client';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Table, Checkbox, Button } from 'antd';
import { GET_BOOKINGS_BY_USER_ID } from '@/graphql/mutations';
import styles from './user-profile.module.css';
import { FaGear } from 'react-icons/fa6';
import jsPDF from 'jspdf';
// import 'jspdf-autotable';
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'; // For Excel export

// Define types for the User and Booking data
interface User {
  id: string;
  phone: string;
  email: string;
  name: string;
  city: string;
  state: string;
  country: string;
}

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: string;
  vehicle: {
    make: string;
    model: string;
  };
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const sessionUser: User = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (sessionUser) {
      setUser(sessionUser);
    }
  }, []);

  // Use `useQuery` to fetch bookings for the user
  const { data, loading, error } = useQuery(GET_BOOKINGS_BY_USER_ID, {
    variables: { userId: user?.id },
    skip: !user, // Skip the query until user data is loaded
  });

  useEffect(() => {
    if (data) {
      setBookings(data.getBookingsByUserId);
    }
  }, [data]);

  if (!user) return <div>Loading...</div>;
  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>Error loading bookings: {error.message}</p>;

  const handleRowSelectionChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const downloadPDF = () => {
    const doc = new jsPDF()
    autoTable(doc,({
      head: [['Start Date', 'End Date', 'Car Model', 'Status', 'Total Price']],
      body: bookings
        .filter(booking => selectedRowKeys.includes(booking.id))
        .map(booking => [
          booking.startDate,
          booking.endDate,
          `${booking.vehicle.make} ${booking.vehicle.model}`,
          booking.status,
          `₹${booking.totalPrice}`,
        ]),
    }));
    doc.save('user-bookings.pdf');
  };

  const downloadExcel = () => {
    const exportData = bookings.filter(booking => selectedRowKeys.includes(booking.id));
    const worksheet = XLSX.utils.json_to_sheet(exportData.map(booking => ({
      StartDate: booking.startDate,
      EndDate: booking.endDate,
      CarModel: `${booking.vehicle.make} ${booking.vehicle.model}`,
      Status: booking.status,
      TotalPrice: `₹${booking.totalPrice}`,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
    XLSX.writeFile(workbook, 'user-bookings.xlsx');
  };

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: <Checkbox onChange={e => {
        setSelectedRowKeys(e.target.checked ? bookings.map(booking => booking.id) : []);
      }} />, // Checkbox to select all
      dataIndex: 'checkbox',
      render: (_: any, record: Booking) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={() => handleRowSelectionChange(
            selectedRowKeys.includes(record.id)
              ? selectedRowKeys.filter(key => key !== record.id)
              : [...selectedRowKeys, record.id]
          )}
        />
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
    },
    {
      title: 'Car Model',
      render: (text: any, record: Booking) => `${record.vehicle.make} ${record.vehicle.model}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      render: (text: string) => `₹${text}`,
    },
  ];

  return (
    <div className={styles.userProfileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.ProfilecardHeader}>
          <h2 className={styles.cardTitle}>{user.name}</h2>
          <button className={styles.editButton}><FaGear /></button>
        </div>
        <div className={styles.usercardContent}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              <img
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className={styles.avatarImage}
              />
              <div className={styles.avatarFallback}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.infoItem}>
              <Mail className={styles.infoIcon} />
              <span>{user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <Phone className={styles.infoIcon} />
              <span>{user.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <MapPin className={styles.infoIcon} />
              <span>{`${user.city}, ${user.state}, ${user.country}`}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bookingsCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Bookings</h2>
          <div>
            <Button onClick={downloadPDF} disabled={selectedRowKeys.length === 0}>
              Download PDF
            </Button>
            <Button onClick={downloadExcel} disabled={selectedRowKeys.length === 0}>
              Download Excel
            </Button>
          </div>
        </div>
        <div className={styles.cardContent}>
          <Table
            columns={columns}
            dataSource={bookings}
            rowKey="id" // Set the row key for Ant Design Table
            pagination={false} // Disable pagination if needed
            locale={{ emptyText: 'No bookings available.' }} // Customize the empty text
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
