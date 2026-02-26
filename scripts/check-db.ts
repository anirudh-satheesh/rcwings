import { prisma } from '../lib/prisma';

async function main() {
    try {
        const result: any = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'User'`;
        console.log('Columns in User table:', JSON.stringify(result, null, 2));

        const hasGoogleId = result.some((col: any) => col.column_name === 'googleId');
        const hasName = result.some((col: any) => col.column_name === 'name');

        if (!hasGoogleId || !hasName) {
            console.error('Critical Error: User table is missing required columns (googleId or name).');
            process.exit(1);
        }

        console.log('Success: User table matches expected schema.');
    } catch (e) {
        console.error('Error checking columns:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
