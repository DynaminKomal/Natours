const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

const app = require('./app');

// Database connection
const connectToDatabase = async () => {
    try {
        const db = process.env.DATABASE_STRING
            .replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
            .replace('DB_NAME', process.env.DATABASE_NAME);

        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true 
        });
        console.log(`App has been connected to the ${process.env.DATABASE_NAME} database`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

// Start the application
const startApp = async () => {
    await connectToDatabase();
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`App running on port: ${port}`);
    });
};

// Initialize the application
startApp();
