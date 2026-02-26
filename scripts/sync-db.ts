/**
 * Manual Database Schema Sync Script
 * 
 * This script bypasses Prisma migrations to apply emergency schema changes.
 * Use this only when:
 * 1. Rapid prototyping in development where migrations are too slow.
 * 2. Fixing emergency production drift (last resort).
 * 
 * Recommended: Use 'npx prisma migrate' for stable schema changes.
 */
import { prisma } from '../lib/prisma';

async function main() {
    try {
        console.log('Attempting to manually update schema via raw SQL...');

        // Add 'name' column if not exists
        await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT');
        console.log('Added "name" column (if not exists)');

        // Add 'googleId' column if not exists
        await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "googleId" TEXT');
        console.log('Added "googleId" column (if not exists)');

        // Create unique index for googleId
        try {
            await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId")');
            console.log('Created unique index for "googleId" (if not exists)');
        } catch (e: any) {
            // Suppress error if index already exists (some PG versions/configurations might throw even with IF NOT EXISTS)
            if (e.message.includes('already exists')) {
                console.log('Index note: User_googleId_key already exists.');
            } else {
                console.error('Critical index error:', e.message);
                process.exit(1);
            }
        }

        // Make password optional
        await prisma.$executeRawUnsafe('ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL');
        console.log('Made "password" column optional');

        console.log('Manual schema update completed successfully.');
    } catch (e: any) {
        console.error('Error during manual schema update:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
