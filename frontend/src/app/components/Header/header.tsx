'use client'
import React, { useState, useEffect } from "react";
import styles from "./header.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Navbar() {
  const [isSidebarActive, setSidebarActive] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // State to check if user is admin
  const router = useRouter();

  useEffect(() => {
    // Function to check user data in session storage
    const checkUserData = () => {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setIsAdmin(user.__typename === "Admin");
      } else {
        setIsAdmin(false); // Reset to false if no user data
      }
    };

    checkUserData(); // Initial check

    // Optionally, you can add a listener to handle session changes
    // This will automatically call checkUserData when session storage changes
    const handleStorageChange = () => {
      checkUserData();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange); // Cleanup listener
    };
  }, []); // Empty dependency array to run only on mount

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    setIsAdmin(false); // Update state after logout
    router.push('/'); // Redirect to home
  };

  // Toggle sidebar visibility on burger click
  const handleBurgerClick = () => {
    setSidebarActive(true);
  };

  // Close sidebar on close button click
  const handleCloseClick = () => {
    setSidebarActive(false);
  };

  return (
    <div className={styles.header}>
      <header>
        <div className={styles.nav}>
          <div className={styles.navLayer}>
            <div id="navLogo">
              <Link href="/" legacyBehavior passHref>
                <Image
                  src="/icons/brand-icon-blue.svg"
                  className={styles.companyLogo}
                  width={370}
                  height={54}
                  alt=""
                />
              </Link>
            </div>
            {/* Navbar navigation links */}
            <div className={styles.navList}>
              <ul className={styles.navLinkList}>
                {/* Only show Sign In and Sign Up buttons if not an admin */}
                {!isAdmin ? (
                  <li className={`${styles.navLinkLi} ${styles.navLinkButtonLi}`} id="navLinkButtonLi">
                    <Link href="/Auth/Login" legacyBehavior passHref>
                      <button className={styles.siginInButton}>Sign in</button>
                    </Link>

                    <Link href="/Auth/Register" legacyBehavior passHref>
                      <button className={styles.signUpButton}>Sign Up</button>
                    </Link>
                  </li>
                ) : (
                  <li className={styles.navLinkLi}>
                    <Link href="/Admin/DashBoard" legacyBehavior passHref>
                      <button className={styles.dashboardButton}>Dashboard</button>
                    </Link>

                    <button onClick={handleLogout} className={styles.logoutButton}>
                      Logout
                    </button>
                  </li>
                )}
              </ul>
              <div className={styles.burger} onClick={handleBurgerClick}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`${styles.sideBar} ${isSidebarActive ? styles.sideBarActive : ""}`}>
          <div>
            <Image
              src="/icons/Group 1261156498chlose.svg"
              alt="Close Icon For Side Bar"
              className={styles.closeButtonIcon}
              onClick={handleCloseClick}
              width="24"
              height="24"
            />
          </div>

          {/* Drop down nav menu */}
          <div className={styles.dropNavMenu}>
            {!isAdmin ? (
              <button className={styles.loginSignUpButton}>Login/Sign Up</button>
            ) : (
              <Link href="/dashboard" passHref>
                <button className={styles.loginSignUpButton}>Dashboard</button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
