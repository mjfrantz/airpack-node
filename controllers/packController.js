const Pack = require('./../models/packModel');

exports.getAllPacks = async (req, res) => {
    try {
        //Build Query
        //1) Filtering
        const queryObj = {
            ...req.query
        };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);

        //1b) Advanced Filtering 
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Pack.find(JSON.parse(queryStr));

        //2) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('price');
        }

        //3) Field limitings
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        } else {
            query = query.select('-__v');
        }

        //4) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 20;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numPacks = await Pack.countDocuments();
            if (skip >= numPacks) throw new Error('This page does not exist');
        }

        //Execute Query
        const packs = await query;

        //Send Response
        res.status(200).json({
            status: 'success',
            results: packs.length,
            data: {
                packs
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail',
            message: err.message
        });
    }
};

exports.getPack = async (req, res) => {
    try {
        const pack = await Pack.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                pack
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail',
            message: err
        });
    }
};

exports.createPack = async (req, res) => {
    try {
        const newPack = await Pack.create(req.body);

        res.status(200).json({
            status: 'success',
            data: {
                pack: newPack
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail',
            message: err
        });
    }
};

exports.updatePack = async (req, res) => {
    try {
        const pack = await Pack.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidator: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                pack
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail',
            message: err.message
        });
    }
};

exports.deletePack = async (req, res) => {

    await Pack.findByIdAndDelete(req.params.id);
    try {
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};