const express = require('express');
const router = express.Router();
const { insertStudentAndCourse, updateStudentCourse, deleteStudent, getAllDetailsByStudent } = require('../controllers/student.controller');

router.post('/insertStudentCourse', insertStudentAndCourse);
router.put('/updateStudentCourse/:itemId', updateStudentCourse);
router.delete('/deleteStudent/:id', deleteStudent);
router.get('/getDetailsByStudent/:id', getAllDetailsByStudent);

module.exports = router;
