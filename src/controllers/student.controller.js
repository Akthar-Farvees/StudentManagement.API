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

    // Ensure required fields are present
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
  const { studentId, newCourseName, studentDetails } = req.body;

  try {
    // Connect to the database
    let pool = await sql.connect(dbConfig);

    // Check if the student exists
    const studentQuery = await pool.request()
      .input('studentId', sql.UniqueIdentifier, studentId)
      .query('SELECT * FROM Students WHERE StudentID = @studentId');

    if (studentQuery.recordset.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // If new course name is provided, find the corresponding CourseID
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

    // Start updating the student details
    let updateStudentQuery = `
      UPDATE Students 
      SET FirstName = @firstName, 
          LastName = @lastName, 
          Gender = @gender,
          DOB = @dob,
          Email = @email,
          PhoneNumber = @phoneNumber,
          Address = @address,
          AcademicYear = @academicYear
    `;
    
    const updateParams = pool.request()
      .input('studentId', sql.UniqueIdentifier, studentId)
      .input('firstName', sql.NVarChar, studentDetails.firstName)
      .input('lastName', sql.NVarChar, studentDetails.lastName)
      .input('gender', sql.NVarChar, studentDetails.gender)
      .input('dob', sql.Date, studentDetails.dob)
      .input('email', sql.NVarChar, studentDetails.email)
      .input('phoneNumber', sql.NVarChar, studentDetails.phoneNumber)
      .input('address', sql.NVarChar, studentDetails.address)
      .input('academicYear', sql.Int, studentDetails.academicYear);

    // If newCourseId is provided, update CourseID
    if (newCourseId) {
      updateStudentQuery += `, CourseID = @newCourseId `;
      updateParams.input('newCourseId', sql.UniqueIdentifier, newCourseId);
    }

    updateStudentQuery += ` WHERE StudentID = @studentId`;

    // Execute the update query
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
    const studentId = req.params.id;  // Get StudentIntID from the URL params

    try {
        // SQL query to delete the student based on the given StudentIntID
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
 
module.exports = {
    insertStudentAndCourse,
    updateStudentCourse,
    deleteStudent
};
