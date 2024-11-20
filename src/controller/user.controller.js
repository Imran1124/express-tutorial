const User = require('../model/user.model');

const createUser = async (req, res) => {
  const { name, email, mobile, address } = req.body;

  try {
    const userExists = await User.findOne({
      email: email,
      mobile: mobile
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

module.exports = {
  createUser,
  getUsers
};
