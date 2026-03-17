function checkAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.send("Access Denied");
  }
}

module.exports = checkAdmin;