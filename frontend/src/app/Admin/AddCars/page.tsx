// pages/add-vehicles.tsx
import DashboardLayout from '../DashBoard/page';
import styles from './add-cars.module.css';

const AddVehicle = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Add Vehicle</h1>
      <form className={styles.form}>
        <div>
          <input type="text" name="vehicleName" placeholder='Make' className={styles.inputfields} />
        </div>
        <div>
          <input type="text" name="vehicleType"   placeholder='Model' className={styles.inputfields}/>
        </div>
        <div>
          <input type="text" name="vehicleModel" placeholder='Year' className={styles.inputfields}/>
        </div>
        <button type="submit" className={styles.submitbutton}>Add Vehicle</button>
      </form>
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
