import { seedUsers } from './models/user.js';
import { connectDataBase } from './config/db.js';

const seedDataBase = async () => {
    try {
        await connectDataBase();
        await seedUsers();
        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('WHY? Bc:', error);
        process.exit(1);
    } finally {
        client.end();
    }
};

seedDataBase();