const router =
    require("express").Router();

const controller =
    require("../controllers/orderController");

const auth =
    require("../middleware/authMiddleware");


router.post(
    "/",
    controller.create
);


router.get(
    "/",
    auth,
    controller.list
);


module.exports = router;