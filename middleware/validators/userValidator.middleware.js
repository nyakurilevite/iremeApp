
const { body, check,query } = require('express-validator');
const Role = require('../../utils/userRoles.utils');
exports.createUserSchema = [
    check('username')
        .exists()
        .withMessage('username is required')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('first_name')
        .exists()
        .withMessage('Your first name is required')
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('last_name')
        .exists()
        .withMessage('Your last name is required')
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    check('role')
        .optional()
        .isIn([Role.Admin, Role.SuperUser,Role.User])
        .withMessage('Invalid Role type'),
    check('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters'),
    check('confirm_password')
        .exists()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field'),
    check('age')
        .optional()
        .isNumeric()
        .withMessage('Must be a number')
];

exports.updateUserSchema = [
    check('username')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('first_name')
        .optional()
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('last_name')
        .optional()
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    check('role')
        .optional()
        .isIn([Role.Admin, Role.SuperUser, Role.User])
        .withMessage('Invalid Role type'),
    check('password')
        .optional()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .isLength({ max: 10 })
        .withMessage('Password can contain max 10 characters')
        .custom((value, { req }) => !!req.body.confirm_password)
        .withMessage('Please confirm your password'),
    check('confirm_password')
        .optional()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field'),
    check('age')
        .optional()
        .isNumeric()
        .withMessage('Must be a number'),
    query()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['username', 'password', 'confirm_password', 'email', 'role', 'first_name', 'last_name'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];

exports.validateLogin = [
    check('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    check('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage('Password must be filled')
];

exports.tokenSchema = [
    check('token')
        .exists()
        .withMessage('Token is required')
        .notEmpty()
];
exports.forgotPasswordSchema = [
    check('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
        ];
exports.resetPasswordSchema = [
    check('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters'),
    check('confirm_password')
        .exists()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field'),
        ];
exports.createStudentSchema = [
    check('student_name')
        .exists()
        .withMessage('Student name is required')
        .notEmpty(),
    check('education_program')
        .exists()
        .withMessage('Education program is required')
        .notEmpty(),
    check('school_level')
        .exists()
        .withMessage('School level is required')
        .notEmpty(),
    check('classroom')
        .exists()
        .withMessage('Classroom is required')
        .notEmpty(),
        ];
 exports.updateStudentSchema = [
    check('student_name')
        .exists()
        .withMessage('Student name is required')
        .notEmpty(),
    check('education_program')
        .exists()
        .withMessage('Education program is required')
        .notEmpty(),
    check('school_level')
        .exists()
        .withMessage('School level is required')
        .notEmpty(),
    check('classroom')
        .exists()
        .withMessage('Classroom is required')
        .notEmpty(),
        ];
