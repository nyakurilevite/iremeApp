
const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/students.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');

const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { 
	createStudentSchema,
	updateStudentSchema
	 } = require('../middleware/validators/userValidator.middleware');


router.get('/', auth(Role.SuperUser), awaitHandlerFactory(studentsController.getAllStudents)); // localhost:3000/api/v1/students
router.get('/:student_id', auth(), awaitHandlerFactory(studentsController.getStudentById)); // localhost:3000/api/v1/students/:student_id
router.get('/myChildren/:account_id', auth(), awaitHandlerFactory(studentsController.getMyChildren)); // localhost:3000/api/v1/students/myChildren
router.post('/', createStudentSchema, awaitHandlerFactory(studentsController.createStudent)); // localhost:3000/api/v1/students
router.patch('/student_id/:student_id', updateStudentSchema, awaitHandlerFactory(studentsController.updateStudent)); // localhost:3000/api/v1/students/update
router.delete('/student_id/:student_id', auth(), awaitHandlerFactory(studentsController.deleteStudent)); // localhost:3000/api/v1/students/delete/:student_id

module.exports = router;