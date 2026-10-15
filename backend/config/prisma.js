// backend/config/prisma.js
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

// PrismaMariaDb mendukung koneksi string MySQL/MariaDB dari .env
const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
