const express = require('express');
const router = express.Router();
const { insertStudent, updateStudentCourse, deleteStudent, getAllDetailsByStudent } = require('../controllers/student.controller');

router.post('/insertStudent', insertStudent);
router.put('/updateStudentCourse/:itemId', updateStudentCourse);
router.delete('/deleteStudent/:id', deleteStudent);
router.get('/getDetailsByStudent/:id', getAllDetailsByStudent);

module.exports = router;
