const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use DATABASE_URL for Render, fallback to individual env vars for local dev
console.log('Database configuration:');
console.log('- DATABASE_URL present:', !!process.env.DATABASE_URL);
console.log('- DATABASE_URL value:', process.env.DATABASE_URL ? '[REDACTED]' : 'undefined');
console.log('- NODE_ENV:', process.env.NODE_ENV);

const sequelize = (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'undefined')
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'vocab_tracker',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

const connectDatabase = async () => {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
      
      // Note: Use migrations instead of sync in production
      // Run: npx sequelize-cli db:migrate
      console.log('Database ready. Make sure to run migrations if needed.');
      return;
    } catch (error) {
      console.error(`Database connection attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (attempt === maxRetries) {
        console.error('All database connection attempts failed. Exiting...');
        process.exit(1);
      }
      
      console.log(`Retrying in ${retryDelay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

module.exports = { sequelize, connectDatabase };