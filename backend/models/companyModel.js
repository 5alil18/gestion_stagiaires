const mongoose = require("mongoose");
const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    ///////////virification d'email
    isVirified:{
      type:Boolean,
      default:false
    },
    verificationToken:{
      type:String,
      default:null
    },
    ////////////////////mot de passe oublié
    resetPaswordToken:{
      type:String,
      default:null
    },
    
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("company", companySchema);

