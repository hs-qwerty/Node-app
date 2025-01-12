const express = require("express");
const mongoose = require("mongoose");
const { PORT } = require("./config/config.js");
const { statusCheck } = require("./controllers/krakenController.js");
const cron = require("node-cron");

// router
const krakenRoute = require("./router/kraken.js");

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cron tab
cron.schedule("* * * * *", () => {
  console.log("Running health checks...");
  statusCheck();
});

app.use("/kraken", krakenRoute);

app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`);
});
