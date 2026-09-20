const router = require("express").Router();

const controller = require("../controllers/cartController");

router.get("/", controller.get);

module.exports = router;