// controller/coursesController.js
const { sql } = require('../config/dbConfig');

const getCourses = async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Courses');
        res.status(200).json(result.recordset); // Send the Courses data as JSON
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ message: 'Error fetching courses data' });
    }
};

module.exports = { getCourses };
