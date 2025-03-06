const { connectDB } = require('../config/dbConfig');

const getCoursesAndStudents = async (req, res) => {
    try {
        const pool = await connectDB();
        const query = `
            SELECT 
                S.StudentID,
                S.StudentIntID,
                S.CourseID,
                S.FirstName,
                S.LastName,
                S.DOB,
                S.Gender,
                S.Email,
                S.PhoneNumber,
                S.Address,
                S.IsActive,
                S.AcademicYear,
                C.CourseName,
                C.CourseDuration,
                C.Credits,
                S.Grade
            FROM Students AS S
            INNER JOIN Courses AS C ON S.CourseID = C.CourseID
            ORDER BY S.DateJoined DESC;
        `;

        const result = await pool.request().query(query);

        if (result.recordset.length === 0) {
            return res.status(  ).json({ message: 'No data found, students and courses are empty' });
        }

        res.status(200).json(result.recordset); 
    } catch (err) {
        console.error('Error fetching students and courses:', err);
        res.status(500).json({ message: 'Error fetching data from students and courses' });
    }
};

module.exports = { getCoursesAndStudents };
