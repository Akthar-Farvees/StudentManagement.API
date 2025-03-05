// src/routes/student.routes.js
const express = require('express');
const router = express.Router();
const { getCourses } = require('../controllers/courses.controller');

// Route to handle the insert operation
router.get('/getCourses', getCourses);


module.exports = router;
