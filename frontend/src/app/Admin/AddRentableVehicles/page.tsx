import React from 'react'
import DashboardLayout from '../DashBoard/page';
import styles from './add-rentable-vehicles.module.css'

const AddRentableVehicles = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Add Rentable Cars</h1>
      <form className={styles.form}>
        <div>
          <input
            type="text"
            name="vehicleName"
            placeholder="Make"
            className={styles.inputfields}
          />
               
        </div>
        <div>
          <input
            type="text"
            name="vehicleModel"
            placeholder="Model"
            className={styles.inputfields}

          />
        </div>
        <div>
          <input
            type="text"
            name="vehicleYear"
            placeholder="Year"
            className={styles.inputfields}
           />
        </div>
        <button type="submit" className={styles.submitbutton}>Add Car</button>
      </form>
    </div>
  )
}

const AddRentableVehiclePage = () => {
    return (
      <DashboardLayout>
        <AddRentableVehicles />
      </DashboardLayout>
    );
  };


export default AddRentableVehiclePage