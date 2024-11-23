const User = require('../model/user.model');
const { generateToken, hash, compare } = require('../utils/jwt');

// reagister user from the database

const register = async (req, res) => {
  const { name, email, mobile, address, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(200).json({ message: 'User already exists' });

    const hashedPassword = await hash(password);

    const user = new User({
      name,
      email,
      mobile,
      address,
      password: hashedPassword
    });

    const result = await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
};

// login user from the database
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'User not found' });

    const validPassword = await compare(password, user.password);
    if (!validPassword)
      return res.status(200).json({ message: 'Invalid password' });

    const token = generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
      mobile: user.mobile,
      roleId: user.roleId,
      staticData: 'logo.png'
    });

    return res.header('Authorization', `Bearer ${token}`).status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
};

module.exports = {
  register,
  login
};
