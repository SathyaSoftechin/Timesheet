const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Role = require('./models/role');

dotenv.config();

const dataRoles = [
  { roleId: 0, roleName: 'admin' },
  { roleId: 1, roleName: 'manager' },
  { roleId: 2, roleName: 'employee' },
];

const seedDatabase = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await connectDB();

    console.log('📥 Seeding roles safely...');

    for (const role of dataRoles) {
      await Role.updateOne(
        { roleId: role.roleId }, // unique key
        role,
        { upsert: true }         // insert if not exists
      );
    }

    console.log('✅ ROLES SEEDED / UPDATED SUCCESSFULLY');
    process.exit(0);
  } catch (error) {
    console.error('❌ SEED FAILED:', error);
    process.exit(1);
  }
};

seedDatabase();
