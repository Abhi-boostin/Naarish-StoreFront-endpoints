require('dotenv').config();
const express = require('express');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
