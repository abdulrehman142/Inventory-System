const express = require('express');
const cors = require('cors');

const app = express();

// Apply CORS middleware here
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use(express.json());
app.use('/api/personnel', require('./routes/empRoutes'));
app.use('/api/poi', require('./routes/poiRoutes'));
app.use('/api/procurement', require('./routes/procurementRoutes'));
app.use('/api/poa', require('./routes/poaRoutes'));
app.use('/api/oap', require('./routes/oapRoutes'));
app.use('/api/custom', require('./routes/customRoutes'));

module.exports = app;
