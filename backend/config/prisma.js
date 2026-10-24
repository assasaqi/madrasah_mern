const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const env = require('./env');

// Singleton Prisma Client dengan adapter MariaDB untuk mencegah kebocoran koneksi
const adapter = new PrismaMariaDb(env.DATABASE_URL);
const prisma = global.prisma || new PrismaClient({ adapter });

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;
