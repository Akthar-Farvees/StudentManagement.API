// src/routes/student.routes.js
const express = require('express');
const router = express.Router();
const { insertStudentAndCourse, updateStudentCourse, deleteStudent } = require('../controllers/student.controller');


// Route to handle the insert operation
router.post('/insertStudentCourse', insertStudentAndCourse);
router.put('/updateStudentCourse', updateStudentCourse);
router.delete('/deleteStudent/:id', deleteStudent);

module.exports = router;
