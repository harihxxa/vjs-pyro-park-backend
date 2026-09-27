require("dotenv").config();

const db = require("./config/db");

const PRODUCTS = [
    [1, "2 3/4\" Kurivi", 40, 8, "1 Pkt", "FLASH LIGHT CRACKERS"],
    [2, "3 1/2\" Lakshmi", 75, 15, "1 Pkt", "FLASH LIGHT CRACKERS"],
    [3, "4\" Lakshmi", 85, 17, "1 Pkt", "FLASH LIGHT CRACKERS"],
    [4, "4\" Gold Lakshmi", 175, 35, "1 Pkt", "FLASH LIGHT CRACKERS"],
    [5, "4\" Deluxe", 150, 30, "1 Pkt", "FLASH LIGHT CRACKERS"],
    [6, "2 Sound Crackers", 140, 28, "1 Pkt", "FLASH LIGHT CRACKERS"],

    [7, "28 Chorsa", 75, 15, "1 Pkt", "ELECTRIC CRACKERS"],

    [8, "0.1K", 200, 40, "1 Box", "FESTIVAL CRACKERS"],
    [9, "1K", 2140, 428, "1 Box", "FESTIVAL CRACKERS"],
    [10, "2K", 4284, 857, "1 Box", "FESTIVAL CRACKERS"],
    [11, "5K", 10710, 2142, "1 Box", "FESTIVAL CRACKERS"],

    [12, "Red Bijili (50 pcs)", 80, 16, "1 Pkt", "BIJILI CRACKERS"],
    [13, "Stripped Bijili (100pcs)", 225, 45, "1 Pkt", "BIJILI CRACKERS"],

    [14, "1 1/2\" Twinkling Star", 150, 30, "1 Box", "TWINKLING STAR"],
    [15, "4\" Twinkling Star", 350, 70, "1 Box", "TWINKLING STAR"],

    [16, "Ultra Pencil", 380, 76, "1 Box", "STICK CRACKERS"],

    [17, "Ground Chakkar Big (10 pcs)", 200, 40, "1 Box", "CHAKKARAMS"],
    [18, "Ground Chakkar Special (10 pcs)", 400, 80, "1 Box", "CHAKKARAMS"],
    [19, "Ground Chakkar Dlx", 600, 120, "1 Box", "CHAKKARAMS"],
    [20, "Wizz Chakkar", 980, 196, "1 Box", "CHAKKARAMS"],

    [21, "Flower Pots Small", 250, 50, "1 Box", "FLOWER POTS"],
    [22, "Flower Pots Big", 350, 70, "1 Box", "FLOWER POTS"],
    [23, "Flower Pots Ashoka", 425, 85, "1 Box", "FLOWER POTS"],
    [24, "Colour Koti", 1000, 200, "1 Box", "FLOWER POTS"],
    [25, "Flower POTS Special", 400, 80, "1 Box", "FLOWER POTS"],
    [26, "Flower Pots Colour Koti Dlx.", 1455, 291, "1 Box", "FLOWER POTS"],

    [27, "7 Shot (5pcs)", 600, 120, "1 Box", "FANCY CRACKERS"],
    [28, "12 Shot Rider (hexagon)", 865, 173, "1 Box", "FANCY CRACKERS"],
    [29, "30 Shot Multicolour UV", 2515, 503, "1 Box", "FANCY CRACKERS"],
    [30, "60 Shot Multicolour UV", 5025, 1005, "1 Box", "FANCY CRACKERS"],
    [31, "120 Shot", 10050, 2010, "1 Box", "FANCY CRACKERS"],
    [32, "240 Shot", 20105, 4021, "1 Box", "FANCY CRACKERS"],

    [33, "2 Sound Rocket", 600, 120, "1 Box", "ROCKETS"],
    [34, "Lunik Rocket", 550, 110, "1 Box", "ROCKETS"],
    [35, "Whistling Rocket", 1160, 232, "1 Box", "ROCKETS"],

    [36, "Chotta Silver", 250, 50, "1 Box", "CHOTTA FANCY"],
    [37, "Chotta Red", 250, 50, "1 Box", "CHOTTA FANCY"],
    [38, "Chotta yellow", 250, 50, "1 Box", "CHOTTA FANCY"],
    [39, "Chotta green", 250, 50, "1 Box", "CHOTTA FANCY"],

    [40, "3 1/2\" Fancy", 1620, 324, "1 Box", "2\" FANCY"],
    [41, "3 1/2\" Fancy Nayagara Falls", 1800, 360, "1 Box", "2\" FANCY"],
    [42, "4\" Fancy", 1925, 385, "1 Box", "2\" FANCY"],

    [43, "Mini Bullet", 150, 30, "1 Box", "FLASH LIGHT CRACKERS"],

    [44, "1000 Digital / Magic", 995, 199, "1 Box", "STONE & CARTOONS"],
    [45, "Jagajai Lax 1 K / 42 K", 2185, 437, "1 Box", "STONE & CARTOONS"],
    [46, "1 1/4\" Chotta Fancy", 225, 45, "1 Box", "STONE & CARTOONS"],
    [47, "Race Car (2 Pcs)", 2600, 520, "1 Box", "STONE & CARTOONS"],
    [48, "Butter Fly", 450, 90, "1 Box", "STONE & CARTOONS"],
    [49, "Peacock Feather (5pcs/box)", 535, 107, "1 Box", "STONE & CARTOONS"],
    [50, "Tin Beer fountain", 530, 106, "1 Box", "STONE & CARTOONS"],
    [51, "Rainbow Smoke (3 Pcs/Box)", 815, 163, "1 Box", "STONE & CARTOONS"],
    [52, "Selfie Stick (5pcs)", 725, 145, "1 Box", "STONE & CARTOONS"],
    [53, "Music Butterfly Series(3 in 1)", 1625, 325, "1 Box", "STONE & CARTOONS"],
    [54, "Holi Fruits", 2000, 400, "1 Box", "STONE & CARTOONS"],
    [55, "Lotus", 750, 150, "1 Box", "STONE & CARTOONS"],
    [56, "Disco Shower 5 in 1", 600, 120, "1 Box", "STONE & CARTOONS"],
    [57, "Photo Flash", 400, 80, "1 Box", "STONE & CARTOONS"],
    [58, "Emu Egg", 1270, 254, "1 Box", "STONE & CARTOONS"],

    [59, "Laptop Match Box", 1100, 220, "1 Box", "MATCH BOX"],
    [60, "3 in 1 Colour Match Box", 45, 19, "1 Box", "MATCH BOX"],

    [61, "Paper Bomb 1/4 kg", 500, 100, "1 Box", "NOVELTIES"],
    [62, "Paper Bomb 1/2 kg", 750, 150, "1 Box", "NOVELTIES"],
    [63, "Paper Bomb 1 kg", 1000, 200, "1 Box", "NOVELTIES"],

    [64, "7 cm 50-50", 70, 14, "1 Box", "SPARKLERS"],
    [65, "7 cm Red", 75, 15, "1 Box", "SPARKLERS"],
    [66, "7 cm Green", 65, 13, "1 Box", "SPARKLERS"],
    [67, "10 cm Electric", 80, 16, "1 Box", "SPARKLERS"],
    [68, "10 cm Colour", 90, 18, "1 Box", "SPARKLERS"],
    [69, "10 cm Green", 100, 20, "1 Box", "SPARKLERS"],
    [70, "10 cm Red", 110, 22, "1 Box", "SPARKLERS"],
    [71, "12 cm Electric", 115, 23, "1 Box", "SPARKLERS"],
    [72, "12 cm Colour", 125, 25, "1 Box", "SPARKLERS"],
    [73, "12 cm Green", 135, 27, "1 Box", "SPARKLERS"],
    [74, "12 cm Red", 145, 29, "1 Box", "SPARKLERS"],
    [75, "15 cm Electric", 205, 41, "1 Box", "SPARKLERS"],
    [76, "15 cm Colour", 225, 45, "1 Box", "SPARKLERS"],
    [77, "15 cm Green", 250, 50, "1 Box", "SPARKLERS"],
    [78, "15 cm Red", 275, 55, "1 Box", "SPARKLERS"],
    [79, "30 cm Electric", 205, 41, "1 Box", "SPARKLERS"],
    [80, "30 cm Colour", 225, 45, "1 Box", "SPARKLERS"],
    [81, "30 cm Red", 250, 50, "1 Box", "SPARKLERS"],
    [82, "30 cm Green", 275, 55, "1 Box", "SPARKLERS"],
    [83, "50 cm Electric", 795, 159, "1 Tube", "SPARKLERS"],
    [84, "50 cm Colour", 815, 163, "1 Tube", "SPARKLERS"],

    [85, "Musical Rocket(5pcs/box)", 850, 170, "1 Box", "NEW ARRIVALS"],
    [86, "Dora(5pcs/ Box)", 1020, 204, "1 Box", "NEW ARRIVALS"],

    [87, "SUN FLASH RED", 355, 71, "1 Box", "CHOTTA 1\""],
    [88, "JOLLY ENJOY", 355, 71, "1 Box", "CHOTTA 1\""],
    [89, "GOLD RANG SILVER", 355, 71, "1 Box", "CHOTTA 1\""],
    [90, "MINNAL STAR SILVER", 355, 71, "1 Box", "CHOTTA 1\""],
    [91, "FLASH INDIA RED", 355, 71, "1 Box", "CHOTTA 1\""],
    [92, "CHOTTA 5 IN 1 COLOUR", 1715, 343, "1 Box", "CHOTTA 1\""],
    [93, "FENTA COLLECTIONS", 1000, 200, "1 Box", "CHOTTA 1\""],

    [94, "GOLD FISH GOLD", 630, 126, "1 Box", "2\" AMAZING THUNDER"],
    [95, "RED DIAMOND RED", 630, 126, "1 Box", "2\" AMAZING THUNDER"],
    [96, "SIGNAL", 630, 126, "1 Box", "2\" AMAZING THUNDER"],
    [97, "DOUBLE STAR RED", 630, 126, "1 Box", "2\" AMAZING THUNDER"],
    [98, "SILVER STAR SILVER", 630, 126, "1 Box", "2\" AMAZING THUNDER"],

    [99, "WHITE QUEEN SILVER", 1765, 353, "1 Box", "2\" 3 TUBE BADA"],
    [100, "DIAMOND RED", 1765, 353, "1 Box", "2\" 3 TUBE BADA"],
    [101, "GOLD KING GOLD", 1765, 353, "1 Box", "2\" 3 TUBE BADA"],
    [102, "SPADE", 1765, 353, "1 Box", "2\" 3 TUBE BADA"],
    [103, "LOVE BIRDS RED", 1765, 353, "1 Box", "2\" 3 TUBE BADA"],

    [104, "BIRDS", 990, 198, "1 Box", "2.75 RANG DHARBAR"],
    [105, "RED RANGER RED", 990, 198, "1 Box", "2.75 RANG DHARBAR"],
    [106, "DOUBLE HEROS RED", 990, 198, "1 Box", "2.75 RANG DHARBAR"],
    [107, "GOLDEN QUEEN GOLD", 990, 198, "1 Box", "2.75 RANG DHARBAR"],
    [108, "NIGHT ANGLEDS SILVER", 990, 198, "1 Box", "2.75 RANG DHARBAR"],
    [109, "SPIDER MAGIC BALM TREE", 990, 198, "1 Box", "2.75 RANG DHARBAR"],

    [110, "DRAGULA ATTACK RED", 1385, 277, "1 Box", "3\" AMAZING THUNDER"],
    [111, "RAISE", 1385, 277, "1 Box", "3\" AMAZING THUNDER"],
    [112, "YELLOW SHOWER", 1385, 277, "1 Box", "3\" AMAZING THUNDER"],
    [113, "NIGHT Angle White Blink", 1385, 277, "1 Box", "3\" AMAZING THUNDER"],
    [114, "FESTIVEL Shock Crackling", 1385, 277, "1 Box", "3\" AMAZING THUNDER"],
    [115, "DIGITAL SHOWER MIXED", 1385, 277, "1 Box", "3\" AMAZING THUNDER"],
    [116, "BOOM RANG", 1385, 277, "1 Box", "3\" AMAZING THUNDER"],
    [117, "BUBBLE BLAZE ORANGE", 1385, 277, "1 Box", "3\" AMAZING THUNDER"],
    [118, "KING QUEEN RED", 1385, 277, "1 Box", "3\" AMAZING THUNDER"],

    [119, "ANGEL DREAM", 1675, 335, "1 Box", "3.5\" AMAZING THUNDER"],
    [120, "HEAT BEAT RED", 1675, 335, "1 Box", "3.5\" AMAZING THUNDER"],
    [121, "GREEN CITY", 1675, 335, "1 Box", "3.5\" AMAZING THUNDER"],
    [122, "GOLD STAR", 1675, 335, "1 Box", "3.5\" AMAZING THUNDER"],
    [123, "SUN RISE", 1675, 335, "1 Box", "3.5\" AMAZING THUNDER"],

    [124, "QUEEN SHOWER", 1805, 361, "1 Box", "3.5\" AMAZING THUNDER EXTRA COLOURS"],
    [125, "BLUE PEARL", 1805, 361, "1 Box", "3.5\" AMAZING THUNDER EXTRA COLOURS"],
    [126, "COOL RAIN", 1805, 361, "1 Box", "3.5\" AMAZING THUNDER EXTRA COLOURS"],
    [127, "BINGO BOOM", 1805, 361, "1 Box", "3.5\" AMAZING THUNDER EXTRA COLOURS"],

    [128, "AMAZON PRIME", 3430, 686, "1 Box", "3.5 DOUBLE PACKAGING OTT SERIES"],
    [129, "YOUTUBE", 3430, 686, "1 Box", "3.5 DOUBLE PACKAGING OTT SERIES"],
    [130, "SUNNEXT", 3430, 686, "1 Box", "3.5 DOUBLE PACKAGING OTT SERIES"],
    [131, "ZEE5", 3430, 686, "1 Box", "3.5 DOUBLE PACKAGING OTT SERIES"],
    [132, "VOOT", 3430, 686, "1 Box", "3.5 DOUBLE PACKAGING OTT SERIES"],
    [133, "SONY LIV", 3430, 686, "1 Box", "3.5 DOUBLE PACKAGING OTT SERIES"],
    [134, "HOTSTAR", 3430, 686, "1 Box", "3.5 DOUBLE PACKAGING OTT SERIES"],
    [135, "NETFLIX", 3430, 686, "1 Box", "3.5 DOUBLE PACKAGING OTT SERIES"],

    [136, "Double Ball (red & Green) (green & Violet)", 2400, 480, "1 Box", "3.5\" DOUBLE BALL"],

    [137, "7 Swizzling", 2400, 480, "1 Box", "7 STEP"],
    [138, "7 Crystal", 2400, 480, "1 Box", "7 STEP"],
    [139, "7 Wings", 2400, 480, "1 Box", "7 STEP"],

    [140, "12 STAR SQUARE (R&G)", 805, 161, "1 Box", "REPEATING FUNCTIONS"],
    [141, "12 Star Colour Dlx(R&G) Green", 870, 174, "1 Box", "REPEATING FUNCTIONS"],
    [142, "12 RAIDER", 1250, 250, "1 Box", "REPEATING FUNCTIONS"],

    [143, "25 Star", 1820, 364, "1 Box", "MULTICOLOUR SHOT"],
    [144, "50 Star", 3560, 712, "1 Box", "MULTICOLOUR SHOT"],
    [145, "True 30", 2995, 599, "1 Box", "MULTICOLOUR SHOT"],
    [146, "Tang 30 (long)", 3075, 615, "1 Box", "MULTICOLOUR SHOT"],
    [147, "Instagram 60 (60 Long)", 5975, 1195, "1 Box", "MULTICOLOUR SHOT"],
    [148, "120 Force (multi Colour)", 11665, 2333, "1 Box", "MULTICOLOUR SHOT"],
    [149, "240 Hero Festival Rounder", 23335, 4667, "1 Box", "MULTICOLOUR SHOT"],

    [150, "Jack Daniels (30 Crackling)", 3480, 696, "1 Box", "FULL CRACKLING"],
    [151, "Titanic (60 Crackling)", 6965, 1393, "1 Box", "FULL CRACKLING"],

    [152, "MAGIC MOUNTAIN (GOLD)", 633, 127, "1 Box", "COLOUR FOUNTAIN"],

    [153, "GANGA JAMUNA (5 PCS)", 355, 71, "1 Box", "VARIETIES"],
    [154, "BUTTER FLY (10 PCS)", 550, 110, "1 Box", "VARIETIES"],
    [155, "HELICOPTER (5 PCS)", 550, 110, "1 Box", "VARIETIES"],
    [156, "SPINNER (10 PCS)", 725, 145, "1 Box", "VARIETIES"],
    [157, "SIREN MINI (5 PCS)", 790, 158, "1 Box", "VARIETIES"],
    [158, "SIREN BADA (3 PCS)", 1105, 221, "1 Box", "VARIETIES"],

    [159, "Whistte Rocket", 1160, 232, "1 Box", "SETOUT"],
    [160, "Navarang", 1170, 234, "1 Box", "SETOUT"],
    [161, "Classic Bomb", 555, 111, "1 Box", "SETOUT"],
    [162, "Mighty Bomb", 655, 135, "1 Box", "SETOUT"],
    [163, "chit put", 110, 22, "1 Box", "SETOUT"],
    [164, "Bada peacock", 1920, 384, "1 Box", "SETOUT"],
    [165, "Little peacock", 880, 176, "1 Box", "SETOUT"],
    [166, "Jee boom baa", 40, 8, "1 Box", "SETOUT"],
    [167, "Lolli pop", 960, 192, "1 Box", "SETOUT"],
    [168, "Fountain shower (5pcs)", 360, 72, "1 Box", "SETOUT"],
    [169, "Varnajalam (15 shot)", 2080, 416, "1 Box", "SETOUT"]
];

async function seedProducts() {
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        console.log("");
        console.log("======================================");
        console.log("VJS PYRO PARK - NEW PRODUCT SEED");
        console.log("======================================");
        console.log("Excel products:", PRODUCTS.length);

        if (PRODUCTS.length !== 169) {
            throw new Error(
                `Product count mismatch. Expected 169, found ${PRODUCTS.length}`
            );
        }

        // ----------------------------------------------------
        // 1. DELETE OLD PRODUCTS
        // ----------------------------------------------------
        // Existing orders are NOT deleted.
        // order_items.product_id will become NULL because
        // schema.sql uses ON DELETE SET NULL.
        // ----------------------------------------------------

        await client.query(`
            DELETE FROM products
        `);

        // ----------------------------------------------------
        // 2. DELETE OLD CATEGORIES
        // ----------------------------------------------------

        await client.query(`
            DELETE FROM categories
        `);

        // ----------------------------------------------------
        // 3. CREATE UNIQUE CATEGORY MAP
        // ----------------------------------------------------

        const categoryMap = {};

        for (const product of PRODUCTS) {
            const categoryName = product[5].trim();

            const categoryKey = categoryName.toLowerCase();

            if (!categoryMap[categoryKey]) {
                const result = await client.query(
                    `
                    INSERT INTO categories (name)
                    VALUES ($1)
                    RETURNING id
                    `,
                    [categoryName]
                );

                categoryMap[categoryKey] = result.rows[0].id;
            }
        }

        // ----------------------------------------------------
        // 4. INSERT ALL PRODUCTS
        // ----------------------------------------------------

        let inserted = 0;

        for (const product of PRODUCTS) {
            const [
                serialNo,
                name,
                mrp,
                finalRate,
                pack,
                categoryName
            ] = product;

            const categoryId =
                categoryMap[categoryName.toLowerCase()];

            const code =
                "VJS-" +
                String(serialNo).padStart(3, "0");

            // Excel has 80% discount rate.
            // Calculate the actual percentage from MRP/final rate.
            const discount =
                mrp > 0
                    ? Number(
                        (
                            ((mrp - finalRate) / mrp) *
                            100
                        ).toFixed(2)
                    )
                    : 0;

            await client.query(
                `
                INSERT INTO products
                (
                    code,
                    name,
                    category_id,
                    pack,
                    mrp,
                    discount,
                    final_rate,
                    stock,
                    icon,
                    active
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
                    $9,
                    TRUE
                )
                `,
                [
                    code,
                    name,
                    categoryId,
                    pack,
                    mrp,
                    discount,
                    finalRate,
                    0,
                    "🎆"
                ]
            );

            inserted++;
        }

        await client.query("COMMIT");

        // ----------------------------------------------------
        // 5. VERIFY DATABASE
        // ----------------------------------------------------

        const productCount = await db.query(`
            SELECT COUNT(*) AS count
            FROM products
            WHERE active = TRUE
        `);

        const categoryCount = await db.query(`
            SELECT COUNT(*) AS count
            FROM categories
        `);

        console.log("");
        console.log("======================================");
        console.log("SEED COMPLETED SUCCESSFULLY ✅");
        console.log("======================================");
        console.log("Inserted products :", inserted);
        console.log(
            "Database products :",
            productCount.rows[0].count
        );
        console.log(
            "Database categories:",
            categoryCount.rows[0].count
        );
        console.log("======================================");
        console.log("");

    } catch (error) {
        await client.query("ROLLBACK");

        console.error("");
        console.error("======================================");
        console.error("PRODUCT SEED FAILED ❌");
        console.error("======================================");
        console.error(error);
        console.error("");

        process.exitCode = 1;

    } finally {
        client.release();
    }
}

seedProducts();