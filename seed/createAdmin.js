import { User } from "../src/models/user.model.js";

const createAdmin = async () => {
  const exists = await User.findOne({ email: 'waqasahmadkhan@gmail.com' });
  if (!exists) {
    await User.create({
      name: 'waqas',
      email: 'waqasahmadkhan@gmail.com',
      password: '123456',   // will be auto-hashed by pre-save hook
      role: 'admin'
    });
    console.log('Admin created');
  }
};