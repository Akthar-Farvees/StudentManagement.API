const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/dbConfig.js');

const helmet = require('helmet');
const studentRoutes = require('./routes/student.routes.js');
const coursesRoute = require('./routes/course.routes.js');
const coursesStudentsRoute = require('./routes/course.student.routes.js');

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(helmet());

connectDB();

app.use('/api/students', studentRoutes);
app.use('/api/courses', coursesRoute);
app.use('/api/student-course', coursesStudentsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
