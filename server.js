require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./src/config/dbConfig');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Connect to Database
connectDB();

// Routes
const userRoutes = require('./src/routes/student.routes');
app.use('/api/Students', userRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
