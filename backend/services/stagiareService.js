const stagiare = require("../models/stagiaresModel");
/////////////////////////////get all stagiare
const getAllStagiares = (companyId) => {
  return stagiare.find({ company: companyId }).select('-company');
};



////////////////////////////get stagiare by domain
const getStagiareByDomain = (domaine, companyId) => {
  return stagiare.find({ domaine, company: companyId }).select('-company');
};



/////////////////////////// add stagiare
const createStagiare = (data) => {
  return stagiare.create(data);
};

///////////////////////// delete stagaire
const deleteStagiare = (id, companyId) => {
  return stagiare.findOneAndDelete({ _id: id, company: companyId });
};

module.exports = {
  getAllStagiares,
  getStagiareByDomain,
  createStagiare,
  deleteStagiare,
};
