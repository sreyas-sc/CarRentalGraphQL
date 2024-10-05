// models/booking-model.js
import { DataTypes } from 'sequelize';
import sequelize from './db.js'; // Ensure you have your sequelize instance imported

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    vehicleId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status:{
        type: DataTypes.STRING,
        allowNull:  false,
    },
    totalPrice: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}
);

const syncBookingsTable = async () => {
    await Booking.sync(); // This creates the table if it doesn't exist
};

syncBookingsTable(); 

// Export the Booking model
export default Booking;
