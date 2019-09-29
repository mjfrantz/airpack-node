const express = require("express");

const router = express.Router();
const mailController = require("./../controllers/mailController");

router.route("/mailchimp").post(mailController.signUpMailchimp);

module.exports = router;
