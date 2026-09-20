const jwt = require("jsonwebtoken");


module.exports = (
    req,
    res,
    next
) => {

    try {

        const header =
            req.headers.authorization || "";


        const token =
            header.startsWith("Bearer ")
                ? header.slice(7)
                : null;


        if (!token) {

            return res.status(401).json({
                message: "Login required"
            });

        }


        req.user =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        next();


    } catch (error) {

        res.status(401).json({
            message:
                "Invalid or expired token"
        });

    }

};