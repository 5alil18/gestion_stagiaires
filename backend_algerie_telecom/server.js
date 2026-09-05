require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const helmet = require("helmet");
app.use(helmet());
const cors = require("cors");

app.use(cors());
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

