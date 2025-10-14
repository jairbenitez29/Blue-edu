import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.MYSQL_PUBLIC_URL,
      },
    },
    // Optimización para Vercel serverless
    // @ts-ignore - estas opciones están disponibles pero no en los tipos
    __internal: {
      engine: {
        // Aumentar timeout de conexión para Railway
        connection_timeout: 20,
        query_timeout: 60,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Cerrar conexiones cuando el proceso termina (importante para serverless)
if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    process.on('beforeExit', async () => {
      await prisma.$disconnect();
    });
  }
}
