const house = require('../model/house.model');
const User = require('../model/user.model');

// create house
const createHouse = async (req, res) => {
  try {
    const { houseName, houseType, houseAddress, userId } = req.body;
    const newHouse = new house({
      userId: userId,
      houseName,
      houseType,
      houseAddress
    });
    await newHouse.save();
    res.status(200).json({
      message: 'House created',
      newHouse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
};

// get all houses with user
const getAllhouse = async (req, res) => {
  const { page = 1, limit = 10, q } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  };
  const query = [
    {
      $sort: {
        createdAt: -1
      }
    }
  ];
  if (q) {
    query.push({
      $match: {
        houseName: {
          $regex: q,
          $options: 'i'
        }
      }
    });
  }
  try {
    const housesData = house.aggregate([
      ...query,
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },

      {
        $project: {
          houseName: 1,
          houseType: 1,
          houseAddress: 1,
          user: {
            name: 1,
            email: 1,
            mobile: 1,
            address: 1
          }
        }
      }
    ]);
    const houses = await house.aggregatePaginate(housesData, options);
    res.status(200).json({
      message: 'All houses',
      houses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
};

// get all houses by user
const getAllhouseByUser = async (req, res) => {
  const { page = 1, limit = 10, q } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  };
  const query = [
    {
      $sort: {
        createdAt: -1
      }
    }
  ];
  if (q) {
    query.push({
      $match: {
        name: {
          $regex: q,
          $options: 'i'
        }
      }
    });
  }
  try {
    const userData = User.aggregate([
      ...query,
      {
        $lookup: {
          from: 'houses',
          localField: '_id',
          foreignField: 'userId',
          as: 'house'
        }
      },

      {
        $project: {
          name: 1,
          email: 1,
          mobile: 1,
          address: 1,
          house: {
            houseName: 1,
            houseType: 1,
            houseAddress: 1
          }
        }
      }
    ]);
    const users = await User.aggregatePaginate(userData, options);
    res.status(200).json({
      message: 'All houses by user',
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
};

const withoutAggrigate = async (req, res) => {
  try {
    const houses = await house.find().populate('userId');
    res.status(200).json({
      message: 'All houses',
      houses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
};

module.exports = {
  createHouse,
  getAllhouse,
  getAllhouseByUser,
  withoutAggrigate
};
