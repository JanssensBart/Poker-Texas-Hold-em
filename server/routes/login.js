const express = require("express");
const router = express.Router();
const logingController = require('../controllers/loginController')

router.post('/' , logingController.handleLogin)

module.exports = router;