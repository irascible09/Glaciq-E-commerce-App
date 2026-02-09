// Script to drop the unique index on phone field
// This fixes the duplicate key error for Google OAuth users

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function fixPhoneIndex() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected!');

        const collection = mongoose.connection.db.collection('users');

        // List current indexes
        console.log('\nCurrent indexes:');
        const indexes = await collection.indexes();
        indexes.forEach(idx => console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`));

        // Check if phone_1 index exists
        const phoneIndex = indexes.find(idx => idx.name === 'phone_1');

        if (phoneIndex) {
            console.log('\nDropping phone_1 index...');
            await collection.dropIndex('phone_1');
            console.log('✅ phone_1 index dropped successfully!');
        } else {
            console.log('\n✅ phone_1 index does not exist - nothing to drop');
        }

        // List indexes after fix
        console.log('\nIndexes after fix:');
        const newIndexes = await collection.indexes();
        newIndexes.forEach(idx => console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`));

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

fixPhoneIndex();
