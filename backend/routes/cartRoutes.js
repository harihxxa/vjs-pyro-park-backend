const router = require("express").Router();

const controller = require("../controllers/cartController");

router.get("/", controller.list);

module.exports = router;