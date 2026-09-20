const router = require("express").Router();

const controller = require("../controllers/categoryController");
const auth = require("../middleware/authMiddleware");


// Get all categories
router.get(
    "/",
    controller.list
);


// Create category
router.post(
    "/",
    auth,
    controller.create
);


module.exports = router;