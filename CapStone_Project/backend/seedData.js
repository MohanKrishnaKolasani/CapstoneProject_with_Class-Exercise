const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const Role     = require('./models/Role');
const User     = require('./models/User');
require('dotenv').config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const existingAdmin = await Role.findOne({ roleName: 'admin' });
  const existingUser  = await Role.findOne({ roleName: 'user' });

  if (!existingAdmin) {
    await Role.create({ roleName: 'admin' });
    console.log('✔ Admin role created');
  } else {
    console.log('✔ Admin role already exists');
  }

  if (!existingUser) {
    await Role.create({ roleName: 'user' });
    console.log('✔ User role created');
  } else {
    console.log('✔ User role already exists');
  }
  const adminRole = await Role.findOne({ roleName: 'admin' });

  const existingAdminUser = await User.findOne({ email: 'admin@musiclibrary.com' });
  if (existingAdminUser) {
    console.log('✔ Admin user already exists');
  } else {
    const hashed = await bcrypt.hash('Admin@1234', 10);
    await User.create({
      name:     'Admin',
      email:    'admin@musiclibrary.com',
      phone:    '9999999999',
      password: hashed,
      roleId:   adminRole._id,
    });
    console.log('✔ Admin user created');
    console.log('  Email   : admin@musiclibrary.com');
    console.log('  Password: Admin@1234');
  }

  console.log('\n Seeding complete! You can now register users and log in as admin.');
  process.exit();
};

seed().catch(err => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});