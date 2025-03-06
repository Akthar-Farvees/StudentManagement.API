const { sql } = require('../config/dbConfig');
const { connectDB, dbConfig } = require('../config/dbConfig.js');

const insertStudentAndCourse = async (req, res) => {
    const {
        firstName,
        lastName,
        dob,
        gender,
        email,
        phoneNumber,
        address,
        courseName,
        academicYear
    } = req.body;

    if (!firstName || !lastName || !email || !courseName) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const result = await sql.query`
            EXEC InsertStudent 
                @FirstName = ${firstName}, 
                @LastName = ${lastName}, 
                @DOB = ${dob}, 
                @Gender = ${gender}, 
                @Email = ${email}, 
                @PhoneNumber = ${phoneNumber}, 
                @Address = ${address}, 
                @CourseName = ${courseName}, 
                @AcademicYear = ${academicYear}`;
        
        res.status(200).json({ message: "Student and course inserted successfully!", data: result.recordset });
    } catch (err) {
        console.error("Error calling stored procedure: ", err.message);
        res.status(500).json({ error: "Failed to insert data" });
    }
};


const updateStudentCourse = async (req, res) => {
  const { newCourseName, studentDetails } = req.body; 
  const { itemId } = req.params; 

  try {
    let pool = await sql.connect(dbConfig);

    const studentQuery = await pool.request()
      .input('studentId', sql.UniqueIdentifier, itemId) 
      .query('SELECT * FROM Students WHERE StudentID = @studentId');

    if (studentQuery.recordset.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    let newCourseId = null;
    if (newCourseName) {
      const courseQuery = await pool.request()
        .input('courseName', sql.NVarChar, newCourseName)
        .query('SELECT CourseID FROM Courses WHERE CourseName = @courseName');

      if (courseQuery.recordset.length === 0) {
        return res.status(404).json({ message: 'Course not found' });
      }

      newCourseId = courseQuery.recordset[0].CourseID;
    }

    let updateStudentQuery = `
      UPDATE Students 
      SET FirstName = @firstName, 
          LastName = @lastName, 
          DOB = @dob,
          Grade = @grade
    `;
    
    const updateParams = pool.request()
      .input('firstName', sql.NVarChar, studentDetails.firstName)
      .input('lastName', sql.NVarChar, studentDetails.lastName)
      .input('dob', sql.Date, studentDetails.dob)
      .input('grade', sql.NVarChar, studentDetails.grade);


    if (newCourseId) {
      updateStudentQuery += `, CourseID = @newCourseId `;
      updateParams.input('newCourseId', sql.UniqueIdentifier, newCourseId);
    }

    updateStudentQuery += ` WHERE StudentID = @studentId`;

    updateParams.input('studentId', sql.UniqueIdentifier, itemId); 

    const result = await updateParams.query(updateStudentQuery);

    if (result.rowsAffected[0] > 0) {
      return res.status(200).json({ message: 'Student updated successfully' });
    } else {
      return res.status(400).json({ message: 'Failed to update student' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    sql.close();
  }
};


const deleteStudent = async (req, res) => {
    const studentId = req.params.id;  

    try {
        const result = await sql.query`DELETE FROM Students WHERE StudentID = ${studentId}`;

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Student deleted successfully' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ message: 'Error deleting student' });
    }
};
 
const getAllDetailsByStudent = async (req, res) => {
  const studentId = req.params.id;

  try {

    await connectDB(); 

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
      WHERE S.StudentID = @studentId
      ORDER BY S.DateJoined DESC;
    `;

    const request = new sql.Request();
    request.input('studentId', sql.UniqueIdentifier, studentId); 

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'No student found with the provided ID' });
    }

    res.status(200).json(result.recordset); 
  } catch (err) {
    console.error('Error executing query:', err);
    return res.status(500).json({ error: 'Error executing query', details: err.message });
  }
};


module.exports = {
    insertStudentAndCourse,
    updateStudentCourse,
    deleteStudent,
    getAllDetailsByStudent
};
