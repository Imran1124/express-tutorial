const User = require("../model/user.model");
const OTP = require("../model/OTP.model");
const { generateToken, hash, compare } = require("../utils/jwt");
const nodemailer = require("../utils/mailer");
// reagister user from the database

const register = async (req, res) => {
  const { name, email, mobile, address, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(200).json({ message: "User already exists" });

    const hashedPassword = await hash(password);

    const user = new User({
      name,
      email,
      mobile,
      address,
      password: hashedPassword,
    });

    const result = await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// login user from the database
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: "User not found" });

    const validPassword = await compare(password, user.password);
    if (!validPassword)
      return res.status(200).json({ message: "Invalid password" });

    const token = generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
      mobile: user.mobile,
      roleId: user.roleId,
      staticData: "logo.png",
    });

    return res.header("Authorization", `Bearer ${token}`).status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
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
      otp,
    });
    await otpCreate.save();

    const mailerResult = await nodemailer(
      email,
      `Your OTP is ${otp}`,
      "OTP for Email Verification",
      `
      <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your One-Time Password (OTP)</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 30px;
            text-align: center;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 20px;
        }
        .otp-code {
            background-color: #f0f0f0;
            border-radius: 8px;
            padding: 15px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 4px;
            color: #2c3e50;
            display: inline-block;
            margin: 20px 0;
        }
        .disclaimer {
            font-size: 12px;
            color: #7f8c8d;
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="/api/placeholder/150/50" alt="Your Company Logo" class="logo">
        
        <h1>Verify Your Account</h1>
        
        <p>We received a request to verify your account. Please use the One-Time Password (OTP) below:</p>
        
        <div class="otp-code">
            ${otp}
        </div>
        
        <p>This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
        
        <div class="disclaimer">
            If you did not request this verification, please ignore this email or contact support.
        </div>
        
        <div class="footer">
            © 2024 Your Inventory Management App. All rights reserved.
        </div>
    </div>
</body>
</html>
      `
    );
    if (mailerResult) {
      return res
        .status(200)
        .json({ message: "OTP sent successfully", success: true });
    }
    return res.status(200).json({ message: "OTP not sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// verify otp for register or login
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpData = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
    if (!otpData)
      return res.status(200).json({ message: "Invalid OTP", success: false });

    const user = await User.findOne({
      email,
    });

    if (!user)
      return res.status(200).json({
        message: "User not found",
        success: true,
        isUserExist: false,
      });

    const token = generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
      mobile: user.mobile,
      roleId: user.roleId,
    });

    return res.header("Authorization", `Bearer ${token}`).status(200).json({
      message: "Login successful",
      success: true,
      token,
      isUserExist: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const registerUserViaOtp = async (req, res) => {
  const { name, email, mobile, address, otp } = req.body;
  try {
    const otpData = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
    if (!otpData)
      return res.status(200).json({ message: "Invalid OTP", success: false });

    const userExist = await User.findOne({ email });
    if (userExist)
      return res
        .status(200)
        .json({ message: "User already exists", success: false });

    const user = new User({
      name,
      email,
      mobile,
      address,
    });

    const result = await user.save();

    const token = generateToken({
      id: result._id,
      email: result.email,
      name: result.name,
      mobile: result.mobile,
      roleId: result.roleId,
    });

    return res.header("Authorization", `Bearer ${token}`).status(200).json({
      message: "User registered successfully",
      token,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
  sendOtpViaEmail,
  verifyOtp,
  registerUserViaOtp,
};
