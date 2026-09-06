require("dotenv").config();
const express = require("express");
const app = express();
/////////////////:json
app.use(express.json());
////////////////helmet
const helmet = require("helmet");
app.use(helmet());

//////////////////cors
const cors = require("cors");
app.use(cors());

/////////////////////xss (cross site Scripting)
const xss = require("xss-clean")
app.use(xss());
//////////////////////////connecter mongoose
const connectDB= require("./config/db");
connectDB();

const stagiareRouter = require("./routes/stagiareRoute");
const companyRouter = require("./routes/companyRoute");

///////////////////routes

app.use("/api/stagiares", stagiareRouter);
app.use("/api/company", companyRouter);

const port = process.env.port;
app.listen(port, () => {
  console.log("le serveur demare sur le port " + port);
});

