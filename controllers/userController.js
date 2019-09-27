const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");

//Loop through all the fields that are in obj check if it is allowed and create in new obj
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //Send Response
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1. Create error if user POST password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }

  //2. Filtered out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email"); //Can add more fields such as images

  //3. Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidator: true
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!"
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!"
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!"
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!"
  });
};
