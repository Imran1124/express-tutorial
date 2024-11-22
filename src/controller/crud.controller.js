const mongoose = require('mongoose');
const Joi = require('joi');
const User = require('../model/user.model');
const Log = require('../model/logmodel');

const createUser = async (req, res) => {
  const { name, email, mobile, address } = req.body;

  const schema = Joi.object({
    name: Joi.string().required().min(3).max(30).label('Name'),
    email: Joi.string().email().required().label('Email'),
    mobile: Joi.string().required().min(10).max(10).label('Mobile'),
    address: Joi.string().required().min(3).max(100).label('Address')
    
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(200).json({
      success: false,
      message: error.details[0].message
    });
  }

  try {
    const userExists = await User.findOne({
      email: email
    });

    if (userExists) {
      return res.status(200).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = new User({
      name,
      email,
      mobile,
      address
    });

    const result = await user.save();

    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

// get all users
const getUsers = async (req, res) => {
  try {
    // only name,email
    const users = await User.find({});

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

// get single user by id
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const userVar = await User.findById(id);

    if (!userVar) {
      return res.status(200).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: userVar,
      message: 'User found'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};

// update user by id
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, address } = req.body;
  try {
    const userVar = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        mobile,
        address
      },
      { new: false }
    );

    if (!userVar) {
      return res.status(200).json({
        success: false,
        message: 'User not found'
      });
    }

    const log = new Log({
      userLog: {
        userId: userVar._id,
        name: userVar.name,
        email: userVar.email,
        mobile: userVar.mobile,
        address: userVar.address
      }
    });

    await log.save();

    return res.status(200).json({
      success: true,
      data: userVar,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};

// delete user by id
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userVar = await User.findByIdAndDelete(id);

    if (!userVar) {
      return res.status(200).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};

// get all Log
const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const getLogById = async (req, res) => {
  const { id } = req.params;

  try {
    const logVar = await Log.findById(id);

    if (!logVar) {
      return res.status(200).json({
        success: false,
        message: 'Log not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: logVar,
      message: 'Log found'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};

// get log by userId from log collection
const getLogByUserId = async (req, res) => {
  const { id } = req.params;

  try {
  

    const userVar = await Log.find({
      "userLog.userId":new mongoose.Types.ObjectId(id)
    });

    if (!userVar) {
      return res.status(200).json({
        success: false,
        message: 'User not found'
      });
    }
   
    return res.status(200).json({
      success: true,
      data: userVar,
      message: 'Log found'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};



module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getLogs,
  getLogById,
  getLogByUserId
};
