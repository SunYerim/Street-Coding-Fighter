const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const problemRoutes = require('./routes');

mongoose.connect(process.env.DB, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => {
  console.log('connected to DB');
}).catch((err) => {
  console.error('Error connecting to DB:', err);
});

app.use('/api', problemRoutes);

module.exports = app;