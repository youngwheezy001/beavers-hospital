import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Database...');

  // 1. Create Your Specific Branches
  const branches = ['Ngong Road Branch', 'El Paso Branch', 'Nairobi CBD Branch'];
  
  for (const name of branches) {
    await prisma.branch.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 2. Create The Full List of Services
  const services = [
    "General Consultation", "Emergency & Casualty", "Cardiac Care",
    "Maternal & Child Health", "Dental Clinic", "Optical Services",
    "OBS/GYN Specialist", "ENT Specialist", "Physiotherapy",
    "Wellness Clinic", "Mental Health Clinic", "Nutrition & Dietetics",
    "Laboratory & Pathology", "Radiology & Imaging", "Comprehensive Care (CCC)"
  ];

  for (const name of services) {
    await prisma.service.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 3. Create Admin User (Optional, useful for login later)
  // You can log in with: admin@beavers.com / admin123
  const adminEmail = 'admin@beavers.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: 'admin123', // In a real app, hash this!
        full_name: 'System Administrator',
        role: 'ADMIN',
        staffProfile: {
          create: { position: 'Administrator', is_online: true }
        }
      }
    });
  }

  console.log('✅ Seeding Complete: Ngong, El Paso, Nairobi & 15 Services Ready.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());