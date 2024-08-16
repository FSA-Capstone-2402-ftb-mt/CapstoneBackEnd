import { seedUsers } from './models/user.js';
import { connectDataBase } from './config/db.js';

const seedDataBase = async () => {
    try {
        await connectDataBase();
        await seedUsers();
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('WHY? Bc:', error);
    }
};

seedDataBase();