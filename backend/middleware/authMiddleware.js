const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not Authorised, no token" });
  }
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user)
      return res.status(401).json({ message: "User no longer exists" });
    next();
  } catch (err) {
    res.status(401).json({ message: "Not Authorised, invalid token" });
  }
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: `Role '${req.user.role}' cannot perform this action`,
        });
    }
    next();
  };
 