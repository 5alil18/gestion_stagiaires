const mongoose = require("mongoose");

const stagiareSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
    unique: true,
  },
  domaine: {
    type: String,
    required: true,
  },
  niveaux: {
    type: String,
    required: true,
  },
  dateDebut: {
    type: String,
    required: true,
  },
  dateFin: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  
});

module.exports = mongoose.model("stagaire", stagiareSchema);
