const { verifyToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const token = req?.headers?.authorization?.split(' ')[1];
  if (!token) {
    return res.status(200).json({
      message: 'Unauthorized'
    });
  }
  try {
    const decode = verifyToken(token);
    req.user = decode;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}

module.exports = authMiddleware;
