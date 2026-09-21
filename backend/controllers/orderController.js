const db = require("../config/db");


/* CREATE ORDER */

exports.create = async (req, res) => {

    const client = await db.connect();

    try {

        const {
            name,
            phone,
            city,
            address,
            message,
            items
        } = req.body;


        if (
            !name ||
            !phone ||
            !address
        ) {

            return res.status(400).json({
                message:
                    "Name, phone and address are required"
            });
        }


        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                message:
                    "Order items are required"
            });
        }


        await client.query("BEGIN");


        const resolvedItems = [];


        /* FIND PRODUCTS */

        for (const item of items) {

            const itemId =
                Number(item.id);

            const itemName =
                String(
                    item.name || ""
                ).trim();

            const qty =
                Number(item.qty);


            if (
                !Number.isInteger(qty) ||
                qty <= 0
            ) {

                await client.query(
                    "ROLLBACK"
                );

                return res.status(400).json({
                    message:
                        "Invalid quantity"
                });
            }


            let productResult;


            /* FIND BY ID */

            if (
                Number.isInteger(itemId) &&
                itemId > 0
            ) {

                productResult =
                    await client.query(
                        `
                        SELECT
                            id,
                            code,
                            name,
                            final_rate,
                            mrp
                        FROM products
                        WHERE id = $1
                        LIMIT 1
                        `,
                        [itemId]
                    );
            }


            /* FIND BY NAME */

            if (
                !productResult ||
                productResult.rows.length === 0
            ) {

                if (!itemName) {

                    await client.query(
                        "ROLLBACK"
                    );

                    return res.status(400).json({
                        message:
                            "Product not found"
                    });
                }


                productResult =
                    await client.query(
                        `
                        SELECT
                            id,
                            code,
                            name,
                            final_rate,
                            mrp
                        FROM products
                        WHERE LOWER(TRIM(name))
                            =
                            LOWER(TRIM($1))
                        LIMIT 1
                        `,
                        [itemName]
                    );
            }


            if (
                !productResult ||
                !productResult.rows.length
            ) {

                await client.query(
                    "ROLLBACK"
                );

                return res.status(400).json({
                    message:
                        "Product not found",
                    productId: itemId,
                    productName: itemName
                });
            }


            const product =
                productResult.rows[0];


            resolvedItems.push({

                productId:
                    Number(product.id),

                productCode:
                    product.code || "",

                productName:
                    product.name,

                qty,

                price:
                    Number(
                        product.final_rate || 0
                    )
            });
        }


        /* TOTAL */

        let total = 0;


        for (
            const item of resolvedItems
        ) {

            total +=
                item.price *
                item.qty;
        }


        /* ORDER NUMBER */

        const now = new Date();

        const dateParts =
            new Intl.DateTimeFormat(
                "en-GB",
                {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                }
            ).formatToParts(now);

        const year =
            dateParts.find(
                p => p.type === "year"
            ).value;

        const month =
            dateParts.find(
                p => p.type === "month"
            ).value;

        const day =
            dateParts.find(
                p => p.type === "day"
            ).value;

        const orderDate =
            `${year}${month}${day}`;


        const countResult =
            await client.query(
                `
                SELECT COUNT(*) AS count
                FROM orders
                WHERE order_number LIKE $1
                `,
                [
                    `VJS-${orderDate}-%`
                ]
            );


        const orderCount =
            Number(
                countResult.rows[0].count
            ) + 1;


        const orderNumber =
            `VJS-${orderDate}-${String(
                orderCount
            ).padStart(2, "0")}`;


        /* CREATE ORDER */

        const orderResult =
            await client.query(
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
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9
                )
                RETURNING id, order_number
                `,
                [
                    orderNumber,
                    name.trim(),
                    phone.trim(),
                    city
                        ? city.trim()
                        : "",
                    address.trim(),
                    message || "",
                    total,
                    "NEW",
                    "WHATSAPP"
                ]
            );


        const orderId =
            orderResult.rows[0].id;


        /* ORDER ITEMS */

        for (
            const item of resolvedItems
        ) {

            await client.query(
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
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                )
                `,
                [
                    orderId,
                    item.productId,
                    item.productCode,
                    item.productName,
                    item.qty,
                    item.price
                ]
            );
        }


        await client.query(
            "COMMIT"
        );


        return res.status(201).json({

            success: true,

            message:
                "Order created successfully",

            orderId,

            orderNumber,

            total
        });


    } catch (error) {

        await client.query(
            "ROLLBACK"
        );


        console.error(
            "ORDER CREATE ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Order creation failed",

            error:
                error.message
        });


    } finally {

        client.release();
    }
};


/* LIST ORDERS */

exports.list = async (
    req,
    res
) => {

    try {

        const result =
            await db.query(
                `
                SELECT
                    o.id,
                    o.order_number,
                    o.customer_name,
                    o.phone,
                    o.city,
                    o.address,
                    o.message,
                    o.total,
                    o.status,
                    o.source,
                    o.created_at
                FROM orders o
                ORDER BY
                    o.created_at DESC
                `
            );


        return res.json({

            orders:
                result.rows

        });


    } catch (error) {

        console.error(
            "ORDER LIST ERROR:",
            error
        );


        return res.status(500).json({

            message:
                error.message
        });
    }
};


/* UPDATE ORDER STATUS */

exports.updateStatus = async (
    req,
    res
) => {

    try {

        const orderId =
            Number(req.params.id);

        const status =
            String(
                req.body.status || ""
            )
            .trim()
            .toUpperCase();


        if (
            !Number.isInteger(orderId) ||
            orderId <= 0
        ) {

            return res.status(400).json({

                message:
                    "Invalid order ID"
            });
        }


        const allowedStatuses = [
            "NEW",
            "CONFIRMED",
            "DELIVERED"
        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid order status"
            });
        }


        const result =
            await db.query(
                `
                UPDATE orders
                SET status = $1
                WHERE id = $2
                RETURNING
                    id,
                    order_number,
                    status
                `,
                [
                    status,
                    orderId
                ]
            );


        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    "Order not found"
            });
        }


        return res.json({

            success: true,

            message:
                "Order status updated",

            order:
                result.rows[0]
        });


    } catch (error) {

        console.error(
            "ORDER STATUS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                error.message
        });
    }
};