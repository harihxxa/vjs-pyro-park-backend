const router = require("express").Router();

const controller = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");


// Get all products
router.get(
    "/",
    controller.list
);


// Get single product
router.get(
    "/:id",
    controller.get
);


// Create product
router.post(
    "/",
    auth,
    controller.create
);


module.exports = router;