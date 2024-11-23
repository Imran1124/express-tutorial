const User = require('../model/user.model');

// get user by token from the database
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(200).json({ message: 'User not found' });

    res.status(200).json({
      message: 'User found',
      user,
      staticData: req.user.staticData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
};

module.exports = {
  getUser
};
