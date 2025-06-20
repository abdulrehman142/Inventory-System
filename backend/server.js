require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Apply CORS middleware before routes
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Routes
app.use('/api/personnel', require('./routes/empRoutes'));
app.use('/api/poi', require('./routes/poiRoutes'));
app.use('/api/procurement', require('./routes/procurementRoutes'));
app.use('/api/poa', require('./routes/poaRoutes'));
app.use('/api/oap', require('./routes/oapRoutes'));
app.use('/api/custom', require('./routes/customRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
