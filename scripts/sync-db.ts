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
            console.log('Index note:', e.message);
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
