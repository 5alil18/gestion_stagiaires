const jwt = require("jsonwebtoken");

const companyModel = require("../models/companyModel");

const middleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send("invalid token");
    }
    const decoded = jwt.verify(token, process.env.secret);

    const company = await companyModel.findById(decoded.id);

    if (!company) {
      return res.status(404).send("company not found ");
    }
    req.company = company;
    next();
  } catch (e) {
    res.status(401).send(e.message);
  }
};

module.exports = middleware;

