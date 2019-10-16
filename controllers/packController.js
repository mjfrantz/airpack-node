const Pack = require('./../models/packModel');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getAllPacks = factory.getAll(Pack);
exports.getPack = factory.getOne(Pack, { path: 'reviews' });
exports.createPack = factory.createOne(Pack);
exports.updatePack = factory.updateOne(Pack);
exports.deletePack = factory.deleteOne(Pack);

/*
SENSEI IVAN PLEASE HELP! -- Aggreate stats!
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
