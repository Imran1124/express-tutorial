const User = require('../model/user.model');
const House = require('../model/house.model');
const { hash } = require('../utils/jwt');

// 1.get user
// 2.get all user
// 3.create user with houses



// 1.get user
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

// 2.get all user 
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
      ...query,
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
      totalDocs: getAllUserData.totalDocs,
      totalPages: getAllUserData.totalPages,
      page: getAllUserData.page,
      limit: getAllUserData.limit,
      succes: true
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' })
  }

}

// 3.create user with houses
const createUserWithHouses = async (req, res) => {
  const { name, email, address, password,mobile, houses } = req.body;

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(200).json({ message: 'User already exist', success: false });
    }
    const hashedPassword = await hash(password);
    const user = new User({
      name,
      email,
      address,
      mobile,
      password: hashedPassword
    });
    const createdUser = await user.save();

    if (createdUser) {
      const housesArray = houses.map(item => ({
        userId: createdUser._id,
        houseName: item.houseName,
        houseType: item.houseType,
        houseAddress: item.houseAddress
      }));
      const housesData = await House.insertMany(housesArray);

      return res.status(201).json({
        message: 'User created successfully',
        user: createdUser,
        houses: housesData
      });
    }
    return res.status(200).json({
      message: 'User not created',
      success: false
    })


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getUser,
  getAllUser,
  createUserWithHouses
};
