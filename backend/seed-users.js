require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User.model');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/docbuddy');
    console.log('Connected to MongoDB.');

    const defaultPassword = 'password123';

    const usersToCreate = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@docbuddy.com',
        password: defaultPassword,
        phone: '1111111111',
        role: 'admin'
      },
      {
        firstName: 'Test',
        lastName: 'Doctor',
        email: 'doctor@docbuddy.com',
        password: defaultPassword,
        phone: '2222222222',
        role: 'doctor',
        doctorDetails: {
          specialization: 'General Physician',
          experience: 10,
          consultationFee: 500,
          isVerified: true
        }
      },
      {
        firstName: 'Test',
        lastName: 'Patient',
        email: 'patient@docbuddy.com',
        password: defaultPassword,
        phone: '3333333333',
        role: 'patient'
      }
    ];

    for (const userData of usersToCreate) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created ${userData.role} user: ${userData.email}`);
      } else {
        console.log(`${userData.role} user already exists: ${userData.email}`);
      }
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
