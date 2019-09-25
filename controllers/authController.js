const jwt = require('jsonwebtoken');
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    //Create two variables of the body object
    const { email, password } = req.body; 

    //1) Check if email and passwords exists
    if(!email || !password) {
      return  next(new appError('Please provide email and password', 400));
    }

    //2 Check if the user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new appError('Incorrect email or password', 401))
    };
    
    //3 If everything is ok, send token to the client
    const token = signToken(user._id);
    res.status(200).json({ 
        status: 'success',
        token
    });
});