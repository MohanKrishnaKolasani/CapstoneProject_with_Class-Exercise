const bcrypt = require('bcryptjs');
const User   = require('../models/User');
const Role   = require('../models/Role');

const getAllUsers = async () => {
  return await User.find({}).select('-password').populate('roleId').sort({ createdAt: -1 });
};

const updateUser = async (id, { name, email, phone, password, roleName }) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  if (name)  user.name  = name.trim();
  if (email) user.email = email.trim().toLowerCase();
  if (phone) user.phone = phone.trim();

  if (password && password.trim().length >= 6) {
    user.password = await bcrypt.hash(password.trim(), 10);
  }

  if (roleName) {
    const role = await Role.findOne({ roleName });
    if (!role) throw new Error(`Role "${roleName}" not found`);
    user.roleId = role._id;
  }

  await user.save();
  return await User.findById(id).select('-password').populate('roleId');
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = { getAllUsers, updateUser, deleteUser };