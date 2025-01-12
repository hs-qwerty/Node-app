const { status } = require("../controllers/krakenController.js");
const router = require("express").Router();

router.route("/status").get(status);

module.exports = router;
