import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDb } from './config/db.js';
import User from './models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DEMO_PASSWORD = 'Password123!';

const DEMO_USERS = [
  { name: 'Apex Weighing & Logistics Ltd', email: 'business@demo.test', role: 'business', company: 'Apex Weighing & Logistics Ltd', gstin: 'GSTIN07AAACA1234F1Z5', state: 'Delhi', district: 'South Delhi' },
  { name: 'Insp. Rajesh Sharma', email: 'lmo@demo.test', role: 'lmo', designation: 'Legal Metrology Officer', zone: 'North Zone', district: 'South Delhi', badgeNumber: 'LMO-01' },
  { name: 'Dr. V. K. Ramanathan', email: 'gatc@demo.test', role: 'gatc', labName: 'National Metrology Standards Lab - GATC North', labCode: 'GATC-DL-001' },
  { name: 'Legal Metrology Controller', email: 'admin@demo.test', role: 'admin', designation: 'Legal Metrology Controller', department: 'Department of Consumer Affairs' }
];

async function seed() {
  await connectDb();
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const demoUser of DEMO_USERS) {
    const existing = await User.findOne({ email: demoUser.email });
    if (existing) {
      console.log(`Skipping ${demoUser.email} (already exists)`);
      continue;
    }
    await User.create({ ...demoUser, passwordHash });
    console.log(`Created ${demoUser.role} demo user: ${demoUser.email} / ${DEMO_PASSWORD}`);
  }

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
