import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// url de connexió a la base de dades PostgreSQL
const connectionString = process.env.DATABASE_URL;

// pool de connexions a la base de dades PostgreSQL (utilitzant la llibreria 'pg')
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// creació d'una instància de PrismaClient amb l'adaptador de PostgreSQL
export const prisma = new PrismaClient({ adapter });