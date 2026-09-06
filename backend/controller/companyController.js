const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../services/comanyServices");


const registerController = async (req, res) => {
  try {
    const createCompany = await register(req.body);
    res.status(201).json({
      msg: "verify your email",
      data: createCompany,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const verifyController = async (req, res) => {
  try {
    const verify = await verifyEmail(req.params.token);
    res.json(verify);
  } catch (e) {
    res.status(404).send(e.message);
  }
};

const loginController = async (req, res) => {
  try {
    const loginCompany = await login(req.body);
    res.status(200).json({
      msg: "welcom back",
      data: loginCompany,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const forgotController = async (req, res) => {
  try {
    const forgot = await forgotPassword(req.body);
    res.status(200).send(forgot);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const resetController = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const reset = await resetPassword(token, newPassword);
    res.status(200).send(reset);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = {
  registerController,
  loginController,
  verifyController,
  resetController,
  forgotController,
};
