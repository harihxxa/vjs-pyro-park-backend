require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;


/* MIDDLEWARE */

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


/* HOME */

app.get("/", (req, res) => {

    res.json({
        message: "VJ Spyro Park API is running",
        status: "success"
    });

});


/* HEALTH */

app.get("/api/health", (req, res) => {

    res.json({
        ok: true,
        message: "Backend is working"
    });

});


/* AUTH */

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);


/* PRODUCTS */

app.use(
    "/api/products",
    require("./routes/productRoutes")
);


/* CATEGORIES */

app.use(
    "/api/categories",
    require("./routes/categoryRoutes")
);


/* ORDERS */

app.use(
    "/api/orders",
    require("./routes/orderRoutes")
);


/* CART */

app.use(
    "/api/cart",
    require("./routes/cartRoutes")
);


/* ERROR HANDLER */

app.use((err, req, res, next) => {

    console.error(
        "SERVER ERROR:",
        err
    );

    res.status(500).json({

        message:
            "Internal server error",

        error:
            err.message

    });

});


/* 404 */

app.use((req, res) => {

    res.status(404).json({

        message:
            "API route not found"

    });

});


/* START SERVER */

app.listen(PORT, () => {

    console.log("");

    console.log(
        "======================================"
    );

    console.log(
        "       VJ SPYRO PARK BACKEND"
    );

    console.log(
        "======================================"
    );

    console.log(
        `Server: http://localhost:${PORT}`
    );

    console.log(
        `Health: http://localhost:${PORT}/api/health`
    );

    console.log(
        `Products: http://localhost:${PORT}/api/products`
    );

    console.log(
        `Orders: http://localhost:${PORT}/api/orders`
    );

    console.log(
        "======================================"
    );

    console.log("");

});