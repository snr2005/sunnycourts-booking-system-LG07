const express = require('express');
const playerRoutes = require('./routes/playerRoutes');
const courtRoutes = require('./routes/courtRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to SunnyCourts Club Booking System API'
  });
});

// Mount modular routes
app.use('/api/players', playerRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/reservations', reservationRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SunnyCourts Club server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
