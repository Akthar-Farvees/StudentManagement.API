const { connectDB } = require('../config/dbConfig');

const getCourses = async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT CourseName, CourseID FROM Courses');
        res.status(200).json(result.recordset); // Send the Courses data as JSON
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ message: 'Error fetching courses data' });
    }
};

module.exports = { getCourses };
