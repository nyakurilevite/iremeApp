
const UserModel = require('../models/user.model');
const StudentsModel = require('../models/students.model');
const TokenModel = require('../models/token.model');

const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const SendEmail = require('../utils/sendEmail.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class StudentsController {
    getAllStudents = async (req, res, next) => {
        let studentList = await StudentsModel.find();
        if (!studentList.length) {
            throw new HttpException(404, 'USER_NOT_FOUND');
        }

       

        res.send(studentList);
    };

    getStudentById = async (req, res, next) => {
        const is_my_child  = await this.is_my_child({parent_id:req.currentUser.account_id,student_id:req.params.student_id});
           
            if(!is_my_child)
            {
                throw new HttpException(404, 'UNAUTHORISED');
            }

        const students = await StudentsModel.find({ student_id: req.params.student_id });
        if (!students) {
            throw new HttpException(404, 'STUDENT_NOT_FOUND');
        }


        res.send(students);
    };

    getMyChildren = async (req, res, next) => {
        if (req.currentUser.account_id!==req.params.account_id) {
            throw new HttpException(401, 'UNAUTHORISED');
        }

        const students = await StudentsModel.find({ parent_id: req.currentUser.account_id });
        if (!students) {
            throw new HttpException(404, 'STUDENT_NOT_FOUND');
        }


        res.send(students);
    };

    createStudent = async (req, res, next) => {
        this.checkValidation(req);
        const find_parent = await UserModel.findOne({ account_id: req.body.parent_id });
        if (!find_parent) {
            throw new HttpException(404, 'PARENT_NOT_FOUND');
        }

        const result = await StudentsModel.create(req.body);
        if (!result) {
            throw new HttpException(500, 'SOMETHING_WENT_WRONG');
        }

        res.status(201).json({ message: 'STUDENT_REGISTERED' });


    };


    updateStudent = async (req, res, next) => {
        this.checkValidation(req);
        // do the update query and get the result
        // it can be partial edit

        const result = await StudentsModel.update(req.body, req.params.student_id);

        if (!result) {
            throw new HttpException(404, 'STUDENT_NOT_FOUND');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'USER_NOT_FOUND' :
            affectedRows && changedRows ? 'USER_UPDATED' : 'USER_UPDATED_FAILED';

        res.send({ message, info });
    };

    deleteStudent = async (req, res, next) => {

            const is_my_child  = await this.is_my_child({parent_id:req.currentUser.account_id,student_id:req.params.student_id});
           
            if(!is_my_child)
            {
                throw new HttpException(404, 'UNAUTHORISED');
            }
            const result = await StudentsModel.delete({ student_id:req.params.student_id});
               if (!result) {
                   throw new HttpException(404, 'STUDENT_NOT_FOUND');
                }
            res.status(200).json({ message: 'STUDENT_DELETED'});   
        

    };


    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'VALIDATION_FAILED', errors);
        }
    };   

    // Middleware for my child
    is_my_child = async ({parent_id:parent_id,student_id:student_id}) => {
        const get_my_children=await StudentsModel.find({ parent_id: parent_id});
        if (get_my_children.length==0) {
            throw new HttpException(401, 'UNAUTHORISED');
        }

       for (var i = 0; i <= get_my_children.length; i++) {
          return get_my_children[i]['student_id']==student_id?true:false;   
       }
    };



    }



/******************************************************************************
 *                               Export
 ******************************************************************************/
>>>>>>> 60c0cc5e5781ca89643264d27a25cf803dea47cd
module.exports = new StudentsController;