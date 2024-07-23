const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());

mongoose.connect(process.env.DB, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => {
  console.log('connected to DB');
}).catch((err) => {
  console.error('Error connecting to DB:', err);
});


module.exports = app;