"use client";
import React, { useState } from "react";
import styles from "./header.module.css";
import Link from "next/link";
import Image from "next/image";

function Navbar() {
  const [isSidebarActive, setSidebarActive] = useState<boolean>(false);

  const nav = [
    { id: 1, link: "", title: "About" },
    { id: 2, link: "", title: "Contact Us" },
  ]

 

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
            {/* <!-- navbar navigation links --> */}
            <div className={styles.navList}>
              <ul className={styles.navLinkList}>
                {nav.map((item) => (
                  <li className={styles.navLinkLi} key={item.id}>
                    <Link href={item.link}>{item.title}</Link>
                  </li>
                ))}
                <li
                  className={`${styles.navLinkLi} ${styles.navLinkButtonLi}`}
                  id="navLinkButtonLi"
                >
                  <Link href="/Auth/Login" legacyBehavior passHref>
                  <button className={styles.siginInButton}>
                    Sign in
                  </button>
                  </Link>

                  {/* <!-- avtar --> */}
                  <Link href="/Auth/Register" legacyBehavior passHref>
                  <button className={styles.signUpButton}>
                    Sign Up
                  </button>
                  </Link>
                </li>
              </ul>
              <div className={styles.burger} onClick={handleBurgerClick}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- sidebar --> */}
        <div
          className={`${styles.sideBar} ${isSidebarActive ? styles.sideBarActive : ""
            }`}
        >
          <div>
            <Image
              src="\icons\Group 1261156498chlose.svg"
              alt="Close Icon For Side Bar"
              className={styles.closeButtonIcon}
              onClick={handleCloseClick}
              width="24"
              height="24"
            />
          </div>

          {/* <!-- Drop down nav menu --> */}
          <div className={styles.dropNavMenu}>
            {nav.map((item, index) => (<>
              <Link href={item.link} key={item.id}>{item.title}</Link>
              <div className={styles.hDivider} key={index}></div></>
            ))}
            <button className={styles.loginSignUpButton}>Login/Sign Up</button>
          </div>


        </div>
      </header>
    </div>
  );
}

export default Navbar;