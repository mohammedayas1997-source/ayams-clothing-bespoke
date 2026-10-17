const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware na tsaro da karbar bayanai
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gwajin lafiyar sabar (Health Check Route)
app.get('/api/health', async (req, res) => {
  res.status(200).json({
    status: 'success',
    brand: 'Ayams Clothing & Bespoke',
    message: 'Backend yana aiki dari bisa dari!',
    timestamp: new Date(),
  });
});

// Haɗa Dukkan Hanyoyin Sadarwa (API Routes)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));

// Hanyoyin Sadarwa na Matsayin Ma'aikata (Roles)
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/manager', require('./routes/managerRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/shop', require('./routes/customerAuthRoutes'));

// Hanyar da ba a sani ba (404 Not Found)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Wannan hanyar (Route) ba ta nan a tsarin Ayams Bespoke.',
  });
});

// Middleware na kula da kurakurai (Error Handler)
app.use(errorHandler);

// Kunna Sabar
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Sabar Ayams Clothing & Bespoke tana aiki a port ${PORT}`);
  console.log(`🔗 Adireshin Yanar Gizo: http://localhost:${PORT}`);
  console.log(`====================================================`);
});