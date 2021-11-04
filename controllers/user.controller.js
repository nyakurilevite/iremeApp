
const UserModel = require('../models/user.model');
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
class UserController {
    getAllUsers = async (req, res, next) => {
        let userList = await UserModel.find();
        if (!userList.length) {
            throw new HttpException(404, 'USER_NOT_FOUND');
        }

        userList = userList.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.send(userList);
    };

    getUserById = async (req, res, next) => {
        const user = await UserModel.findOne({ id: req.params.id });
        if (!user) {
            throw new HttpException(404, 'USER_NOT_FOUND');
        }

        const { password, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    getUserByuserName = async (req, res, next) => {
        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            throw new HttpException(404, 'USER_NOT_FOUND');
        }

        const { password, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    getCurrentUser = async (req, res, next) => {
        const { password, ...userWithoutPassword } = req.currentUser;

        res.send(userWithoutPassword);
    };

    createUser = async (req, res, next) => {
        this.checkValidation(req);
        await this.hashPassword(req);
        const result = await UserModel.create(req.body);
        const create_token=await TokenModel.create({account_id:result,duration:60*60*24});
        //##################SEND EMAIL##############################################
        const to=req.body.email;
        const subject="Complete registration!";
        const link=process.env.APP_URL+"/auth/user/confirm/"+ create_token;
        const link_label="Confirm account";
        const message="Hello <b>"+req.body.first_name+"</b>,\
        thank you for registering to Ireme app.<br>Click on the link below to complete registration";
        const sendEmail= await SendEmail.send(
            {
                to:to,
                subject:subject,
                message:message,
                link:link,
                link_label:link_label
            });
        //################//SEND EMAIL##############################################


        if (!result) {
            throw new HttpException(500, 'SOMETHING_WENT_WRONG');
        }

        res.status(201).json({ message: 'ACCOUNT_CREATED' });


    };
    confirmAccount = async (req, res, next) => {
        const token_valid= await TokenModel.is_token_valid({ token: req.params.token });
        if (!token_valid) {
            const result = await TokenModel.findOne({ token: req.params.token });
            const delete_user = await UserModel.delete({ account_id: result.account_id });
            const delete_token = await TokenModel.delete({ token: req.params.token });

            throw new HttpException(401, 'TOKEN_EXPIRED');
        }

            const result = await TokenModel.findOne({ token: req.params.token });
            if(result)
            {
               const enable_account = await UserModel.update({enabled:'1'},result.account_id);
                      if(enable_account)
                      {
                        const delete_token = await TokenModel.delete({ token: req.params.token });
                        res.status(200).json({ message: 'ACCOUNT_ACTIVATED'});
                      }
                        

            }
        
        
    };

    forgotPassword = async (req, res, next) => {
        this.checkValidation(req);
        const user = await UserModel.findOne(req.body);
        if(!user)
        {
                throw new HttpException(404, 'EMAIL_NOT_FOUND');
        }
        const created_token=await TokenModel.create({account_id:user.account_id,duration:60*60*1});
        //##################SEND EMAIL##############################################
        const to=req.body.email;
        const subject="Forgot your password?";
        const link=process.env.APP_URL+"/auth/user/reset/"+ created_token;
        const link_label="Reset password";
        const message="Hello <b>"+user.first_name+"</b>,\
        click on the link below to reset your account password";
        const sendEmail= await SendEmail.send({to:to,subject:subject,message:message,link:link,link_label:link_label});
        //################//SEND EMAIL##############################################
        if (!sendEmail) {
            throw new HttpException(500, 'SOMETHING_WENT_WRONG');
        }

        res.status(200).json({ message: 'RESET_LINK_SENT' });
    };

    resetPassword = async (req, res, next) => {
        const token_valid= await TokenModel.is_token_valid({ token: req.params.token });
        if (!token_valid) {
            const delete_token = await TokenModel.delete({ token: req.params.token });
            throw new HttpException(401, 'TOKEN_EXPIRED');
        }
        this.checkValidation(req);
        await this.hashPassword(req);
        const { confirm_password, ...restOfUpdates } = req.body;

        // do the update query and get the result
        // it can be partial edit
        const user = await TokenModel.findOne({ token: req.params.token });
        const result = await UserModel.update(restOfUpdates, user.account_id);

        if (!result) {
            throw new HttpException(404, 'SOMETHING_WENT_WRONG');
        }
        const delete_token = await TokenModel.delete({ token: req.params.token });
        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'USER_NOT_FOUND' :
            affectedRows && changedRows ? 'USER_UPDATED' : 'USER_UPDATED_FAILED';

        res.send({ message, info });
    };

    updateUser = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);
        
        const { confirm_password, ...restOfUpdates } = req.body;

        // do the update query and get the result
        // it can be partial edit

        const result = await UserModel.update(restOfUpdates, req.params.account_id);

        if (!result) {
            throw new HttpException(404, 'SOMETHING_WENT_WRONG');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'USER_NOT_FOUND' :
            affectedRows && changedRows ? 'USER_UPDATED' : 'USER_UPDATED_FAILED';

        res.send({ message, info });
    };

    deleteUser = async (req, res, next) => {
        const result = await UserModel.delete({ account_id: req.params.account_id});
        if (!result) {
            throw new HttpException(404, 'USER_NOT_FOUND');
        }
        res.status(200).json({ message: 'USER_DELETED'});

    };

    



    userLogin = async (req, res, next) => {
        this.checkValidation(req);

        const { email, password: pass } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new HttpException(401, 'UNABLE_TO_LOGIN');
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            throw new HttpException(401, 'INCORRECT_PASSWORD');
        }

        // user matched!
        const secretKey = process.env.SECRET_JWT || "";
        const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
            expiresIn: '24h'
        });

        const { password, ...userWithoutPassword } = user;

        res.send({ ...userWithoutPassword, token });
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'VALIDATION_FAILED', errors);
        }
    };

    // hash password if it exists
    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    };


    

    }



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController;