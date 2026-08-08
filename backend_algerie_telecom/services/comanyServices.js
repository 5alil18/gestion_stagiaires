const company = require("../models/companyModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const senderEmail = require("../email/sendEmail");

///////////////////////register service

const register = async (data) => {
  const { email, password, address, name } = data;
  if (!email || !password || !address || !name) {
    throw new Error("all fileds are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  if (password.length < 6) {
    throw new Error("Password must contain at least 6 characters");
  }
  const exist = await company.findOne({ email });
  if (exist) {
    throw new Error("Company already exists");
  }
  const hashingPassword = await bcrypt.hash(password, 10);

  const newAdmin = await company.create({
    email,
    password: hashingPassword,
    address,
    name,
  });
  const token = jwt.sign(
    {
      email,
      id: newAdmin._id,
    },
    process.env.secret,
    {
      expiresIn: "1h",
    },
  );
  newAdmin.verificationToken = token;
  await newAdmin.save();
  ///////////////////////emailSender
  await senderEmail(
    newAdmin.email,
    `http://localhost:3001/verify-email/${token}`,   // url il doit etre comme il comme il est dans le frontend
    "verification email",
  );

  return { newAdmin, token  };
};

//////////////////////// verify email

// ce opiartion fonction aprés d'envoyé le email aprés on receptioné
const verifyEmail = async (token) => {
  const decoded = jwt.verify(token, process.env.secret);
  const exist = await company.findOne({
    _id: decoded.id,
    verificationToken: token,
  });

  if (!exist) {
    throw new Error("compnay not found or token is expired ");
  }
  exist.isVirified = true;
  exist.verificationToken = null;
  await exist.save();
  return { message: "email verfied succefully" };
};


/////////////////////forgot password

const forgotPassword = async (data) => {
  const { email } = data;
  if (!email) {
    throw new Error("email is required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  const exist = await company.findOne({ email });
  if (!exist) {
    throw new Error("company not found ");
  }

  const token = jwt.sign(
    {
      email,
      id: exist._id,
    },
    process.env.secret,
    {
      expiresIn: "1h",
    },
  );
  exist.resetPaswordToken = token;
  await exist.save();

  await senderEmail(
    exist.email,
    `http://localhost:3001/reset-password/${token}`, //if faut faire url comme il est dans react
    "reset your password !",
  );
  
};

//////////////////reset password (function qui envoyé le new pass)

const resetPassword = async (token, newPassword) => {
  if (!newPassword) {
    throw new Error("the password is required");
  }
  if (newPassword.length < 6) {
    throw new Error("Password must contain at least 6 characters");
  }
  const decoded = jwt.verify(token, process.env.secret);
  const exist = await company.findOne({
    _id: decoded.id,
    resetPaswordToken: token,
  });
  if (!exist) {
    throw new Error("company not found or token is expired");
  }
  const hashPassword = await bcrypt.hash(newPassword, 10);
  exist.password = hashPassword;
  exist.resetPaswordToken = null;
  await exist.save();
  return { msg: "the password is changed successfuly" };
};

////////////////////////login service

const login = async (data) => {
  const { email, password } = data;
  if (!email || !password) {
    throw new Error("all filed are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  if (password.length < 6) {
    throw new Error("Password must contain at least 6 characters");
  }
  const exist = await company.findOne({ email });
  if (!exist) {
    throw new Error("ths user is not exist");
  }
  const compare = await bcrypt.compare(password, exist.password);
  if (!compare) {
    throw new Error("wrong password");
  }

  if (!exist.isVirified) {
    throw new Error("verify your email ");
  }
  const token = jwt.sign(
    {
      email,
      id: exist._id,
    },
    process.env.secret,
    {
      expiresIn: "1w",
    },
  );
  return {
    token,
    company: {
      id: exist._id,
      name: exist.name,
      email: exist.email,
      address: exist.address,
    },
  };
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
