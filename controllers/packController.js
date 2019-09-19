const Pack = require("./../models/packModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllPacks = catchAsync(async (req, res, next) => {

  //Execute Query
  const features = new APIFeatures(Pack.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const packs = await features.query;

  //Send Response
  res.status(200).json({
    status: "success",
    results: packs.length,
    data: {
      packs
    }
  });
});

exports.getPack = catchAsync(async (req, res, next) => {

  const pack = await Pack.findById(req.params.id);

  if (!pack) {
    return next(new AppError('No pack found with that ID', 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      pack
    }
  });
});


exports.createPack = catchAsync(async (req, res, next) => {
  const newPack = await Pack.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      pack: newPack
    }
  });
});

exports.updatePack = catchAsync(async (req, res, next) => {
  const pack = await Pack.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true
  });

  if (!pack) {
    return next(new AppError('No pack found with that ID', 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      pack
    }
  });
});

exports.deletePack = catchAsync(async (req, res, next) => {
  const pack = await Pack.findByIdAndDelete(req.params.id);

  if (!pack) {
    return next(new AppError('No pack found with that ID', 404))
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});


/*
ENSEI IVAN PLEASE HELP! -- Aggreate stats!
exports.getPackStats = async (req, res) => {
  try {
    const stats = await Pack.aggregate([{
      $group: {
        _id: null,
        avePrice: {
          $avg: '$price'
        },
        minPrice: {
          $min: '$price'
        },
        maxPrice: {
          $max: '$price'
        }
      }
    }]);

    res.status(200).json({
      status: "success",
      data: {
        stats
      }
    });

  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};*/