const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const sendEmail = require("./../utils/email");


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
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
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

//Protect Middleware
exports.protect = catchAsync(async (req, res, next) => {
    // 1. Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token){
        return next(new appError('You are not logged in! Please log in to get access', 401));
    }

    // 2. Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new appError('The user belonging to the token no longer exist!', 401));
    }
    //4. Check if user changed password after the token was issued 
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError('User recently changed password! Please log in again.', 401)
        );
    }

    //Will go to next route handler grant access to protected route
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next( new appError('You do not have permission to perform this action', 403));
        }

        next();
    };
};

exports.forgotPassword = catchAsync( async (req, res, next) => {
    //1. Get user based on Posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError('There is no user with this email address.', 404));
    }
    //2. Generate the random reset tokens
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3. Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you did not forget your password, please ignore this email!`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 mins)',
            message
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
    }
   
    return next(new appError('There was an error sending the email. Try again later!', 500));
});

exports.resetPassword = (req, res, next) => {};