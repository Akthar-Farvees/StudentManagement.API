// route/coursesStudentsRoute.js
const express = require('express');
const { getCoursesAndStudents } = require('../controllers/courses.students.controller');
const router = express.Router();

router.get('/getCoursesStudents', getCoursesAndStudents);

module.exports = router;
