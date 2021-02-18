// Require .env file only if we are in development mode
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const colors = require('colors');

// Require app settings and configurations
const app = require('./app');

// Config file connecting to DB
const connectDB = require('./config/db');

// Set server PORT
const PORT = process.env.PORT || 5000;

// Listen for app on server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV.underline} on port ${PORT}.`.yellow);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
