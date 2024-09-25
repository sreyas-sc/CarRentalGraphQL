
import Image from 'next/image';
import React, { ReactNode } from 'react';
import Link from 'next/link';
import styles from './admin-dashboard.module.css'; // Make sure the CSS module is properly scoped

// Define types for layout props (useful for TypeScript)
interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.left}>
        <div className={styles.companylogo}>
          <Image
            src="/icons/brand-logo.svg"
            className={styles.companyLogo}
            width={300}
            height={34}
            alt="Company Logo"
          />
        </div>

        {/* Sidebar Navigation Buttons */}
        <div className={styles.dashboardbuttons}>
          <Link href="/" passHref>
            <button className={styles.dashButton}>Home</button>
          </Link>
          <Link href="/add-vehicles" passHref>
            <button className={styles.dashButton}>Add Vehicles</button>
          </Link>
          <Link href="/add-rentable-vehicles" passHref>
            <button className={styles.dashButton}>Add Rentable Vehicles</button>
          </Link>
          <Link href="/view-bookings" passHref>
            <button className={styles.dashButton}>View Bookings</button>
          </Link>
        </div>

        {/* Logout Button */}
        <div className={styles.dashboardbuttonslogout}>
          <button className={styles.dashlogoutButton}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.right}>
        {children} {/* This renders the page content */}
      </div>
    </div>
  );
};

export default DashboardLayout;
