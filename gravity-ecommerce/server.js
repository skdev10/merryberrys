require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const settingsRoutes = require('./routes/settings');

const app = express();

app.use(cors());
app.use(express.json());
// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Fallback logic for protecting protected HTML pages (optional middleware if needed, but handled mostly via client side JS auth redirects)

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gravity_ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected to Gravity Database'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Fallback to index.html for undefined routes mapping to front-end paths
app.get('*', (req, res) => {
  // Simple check to serve admin or public mapping
  if(req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  } else {
    // If it is an HTML file, serve it directly if it exists, otherwise index
    const ext = path.extname(req.path);
    if (!ext) {
       res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
       res.status(404).send('Not Found');
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Gravity Server running on port ${PORT}`);
});
