const User = require('../model/user.model');
const House = require('../model/house.model');
// get user by token from the database
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email address roleId")
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

//get all user 
const getAllUser = async (req, res) => {
  const { page, limit, q } = req.query;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),

  };
  const query = [{
    $sort: {
      createdAt: -1
    }

  }]
  if (q) {
    query.push({ $match: { name: new RegExp(q, 'i') } })
  }

  try {
    const userData = User.aggregate([
      {
        $lookup: {
          from: 'houses',
          localField: '_id',
          foreignField: 'userId',
          as: 'houses'
        }
      },

      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          address: 1,
          houses: 1
        }
      },

    ])

    const getAllUserData = await User.aggregatePaginate(userData, options)

    return res.status(200).json({
      message: 'Users fetched successfully',
      users: getAllUserData.docs,
      succes: true
    });


  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' })
  }



}

module.exports = {
  getUser,
  getAllUser
};
