const User = require('../model/user.model');
const OTP = require('../model/OTP.model');
const { generateToken, hash, compare } = require('../utils/jwt');
const nodemailer = require('../utils/mailer');
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

// 3.Send otp using nodemailer
const sendOtpViaEmail = async (req, res) => {
  const { email } = req.body;
  try {
    // const user = await User.findOne({ email });
    // if (!user) return res.status(200).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpCreate = new OTP({
      email,
      otp
    });
    await otpCreate.save();

    const mailerResult = await nodemailer(
      email,
      `Your OTP is ${otp}`,
      'OTP for Email Verification',
      `
        <html>
          <body>
            <h1>Your OTP is ${otp}</h1>
          </body>
        </html>
      `
    );
    if (mailerResult) {
      return res.status(200).json({ message: 'OTP sent successfully' });
    }
    return res.status(200).json({ message: 'OTP not sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
};

// verify otp for register or login
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpData = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
    if (!otpData) return res.status(200).json({ message: 'Invalid OTP' });

    const user = await User.findOne({
      email
    });

    if (!user)
      return res.status(200).json({
        message: 'User not found',
        success: false,
        isUserExist: false
      });

    const token = generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
      mobile: user.mobile,
      roleId: user.roleId
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

const registerUserViaOtp = async (req, res) => {
  const { name, email, mobile, address, otp } = req.body;
  try {
    const otpData = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
    if (!otpData) return res.status(200).json({ message: 'Invalid OTP' });

    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(200).json({ message: 'User already exists' });

    const user = new User({
      name,
      email,
      mobile,
      address
    });

    const result = await user.save();

    const token = generateToken({
      id: result._id,
      email: result.email,
      name: result.name,
      mobile: result.mobile,
      roleId: result.roleId
    });

    return res.header('Authorization', `Bearer ${token}`).status(200).json({
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Server Error'
    });
  }
};

module.exports = {
  register,
  login,
  sendOtpViaEmail,
  verifyOtp,
  registerUserViaOtp
};
