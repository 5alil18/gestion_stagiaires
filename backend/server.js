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
////////////////////rate limit

// const rate = require("express-rate-limit");
// app.use(
//   rate({
//     windowMs: 15 * 60 * 1000, /////////////////15 minutes
//     max: 5,
//     message: {
//       success: false,
//       message: "many requirest please try again after 15 minutes",
//     },
//   }),
// );

/////////////////////xss (cross site Scripting)
const xss = require("xss-clean");
app.use(xss());
////////////////////hpp( http paramater pollution)
const hpp = require("hpp");
app.use(hpp());
//////////////////////////connecter mongoose
const connectDB = require("./config/db");
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
