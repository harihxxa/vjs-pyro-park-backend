const router = require("express").Router();

const controller = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");


// Get all products
router.get(
    "/",
    controller.list
);

// Create product
router.post(
    "/",
    auth,
    controller.create
);

// Admin: update Sold Out status
router.patch(
    "/:id/sold-out",
    auth,
    controller.updateSoldOut
);

// Get single product
router.get(
    "/:id",
    controller.get
);


module.exports = router;