const db =
    require("../config/db");


/*
CREATE ORDER
*/

exports.create = async (req, res) => {

    const connection =
        await db.getConnection();

    try {

        const {
            name = "Website Customer",
            phone = "",
            city = "",
            address = "",
            message = "",
            items = []
        } = req.body;


        /* VALIDATION */

        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({

                message:
                    "Add at least one product"

            });

        }


        /* CLEAN ITEMS */

        const cleanItems =
            items
                .map(item => ({

                    id:
                        Number(item.id),

                    qty:
                        Math.max(
                            1,
                            Number(item.qty || 1)
                        )

                }))
                .filter(item =>
                    Number.isInteger(item.id) &&
                    item.id > 0
                );


        if (!cleanItems.length) {

            return res.status(400).json({

                message:
                    "Invalid cart items"

            });

        }


        await connection.beginTransaction();


        /*
        GET REAL PRODUCTS FROM DATABASE

        IMPORTANT:
        Price is taken from MySQL,
        not from browser.
        */

        const productIds =
            cleanItems.map(item => item.id);


        const [products] =
            await connection.query(

                `
                SELECT
                    id,
                    code,
                    name,
                    final_rate,
                    active

                FROM products

                WHERE id IN (?)

                AND active = 1
                `,

                [productIds]

            );


        if (
            products.length !==
            cleanItems.length
        ) {

            throw new Error(
                "One or more products are unavailable"
            );

        }


        let total = 0;


        const orderItems = [];


        for (
            const item
            of cleanItems
        ) {

            const product =
                products.find(
                    p =>
                        Number(p.id) ===
                        item.id
                );


            if (!product) {

                throw new Error(
                    "Product not found"
                );

            }


            const price =
                Number(
                    product.final_rate
                );


            const subtotal =
                price * item.qty;


            total += subtotal;


            orderItems.push({

                id:
                    product.id,

                code:
                    product.code,

                name:
                    product.name,

                qty:
                    item.qty,

                price:
                    price

            });

        }


        /*
        UNIQUE ORDER NUMBER
        */

        const orderNumber =
            "VJ-" +
            Date.now() +
            "-" +
            Math.floor(
                100 + Math.random() * 900
            );


        /*
        SAVE ORDER
        */

        const [orderResult] =
            await connection.query(

                `
                INSERT INTO orders
                (
                    order_number,
                    customer_name,
                    phone,
                    city,
                    address,
                    message,
                    total,
                    status,
                    source
                )

                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,

                [
                    orderNumber,

                    name,

                    phone,

                    city,

                    address,

                    message,

                    total,

                    "NEW",

                    "WHATSAPP"
                ]

            );


        const orderId =
            orderResult.insertId;


        /*
        SAVE ORDER ITEMS
        */

        for (
            const item
            of orderItems
        ) {

            await connection.query(

                `
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    product_code,
                    product_name,
                    qty,
                    unit_price
                )

                VALUES
                (?, ?, ?, ?, ?, ?)
                `,

                [
                    orderId,

                    item.id,

                    item.code,

                    item.name,

                    item.qty,

                    item.price

                ]

            );

        }


        await connection.commit();


        /*
        SUCCESS
        */

        res.status(201).json({

            success: true,

            message:
                "Order saved successfully",

            order: {

                id:
                    orderId,

                order_number:
                    orderNumber,

                total:
                    total

            }

        });


    }

    catch (error) {

    await connection.rollback();

    console.log("");
    console.log("======================================");
    console.log("        ORDER DATABASE ERROR ❌");
    console.log("======================================");

    console.log("ERROR MESSAGE:", error.message);
    console.log("ERROR CODE:", error.code);
    console.log("SQL STATE:", error.sqlState);
    console.log("SQL:", error.sql);

    console.log("REQUEST BODY:");
    console.log(req.body);

    console.log("======================================");
    console.log("");

    res.status(500).json({

        success: false,

        message: error.message

    });

}

    finally {

        connection.release();

    }

};


/*
GET ALL ORDERS
ADMIN ONLY
*/

exports.list = async (req, res) => {

    try {

        const [rows] =
            await db.query(

                `
                SELECT
                    id,
                    order_number,
                    customer_name,
                    phone,
                    city,
                    address,
                    message,
                    total,
                    status,
                    source,
                    created_at

                FROM orders

                ORDER BY
                    id DESC
                `

            );


        res.json({

            success: true,

            orders:
                rows

        });


    }

    catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};