let PRODUCTS=[];

const WHATSAPP_NUMBER="919150582228";
const BACKEND_URL="https://vjs-pyro-park-backend.onrender.com";

let activeCat="All";

let cart=JSON.parse(
    localStorage.getItem("vj_cart")||"[]"
);

const icons={
    "Sparklers":"✨",
    "Flower Pots":"🌋",
    "Rockets":"🚀",
    "Bombs":"💥",
    "Chakkars":"🌀",
    "Fancy Crackers":"🎆",
    "Others":"🎇"
};

const CATEGORY_MAP={
    1:"Flower Pots",
    2:"Sparklers",
    3:"Rockets",
    4:"Ground Crackers",
    5:"Fancy Crackers",
    6:"Sound Crackers",
    7:"Chakkars",
    8:"Bombs",
    9:"Others"
};

function money(n){

    return "₹"+Number(n).toLocaleString(
        "en-IN",
        {maximumFractionDigits:2}
    );

}


/* BACKEND CONNECTION TEST */

function testBackend(){

    fetch(BACKEND_URL+"/api/health")
    .then(response=>response.json())
    .then(data=>{

        console.log("================================");
        console.log("BACKEND CONNECTED ✅");
        console.log(data);
        console.log("================================");

    })
    .catch(error=>{

        console.error(
            "BACKEND CONNECTION FAILED ❌",
            error
        );

    });

}


/* LOAD PRODUCTS FROM BACKEND */

async function loadBackendProducts(){

    try{

        const response = await fetch(
            BACKEND_URL + "/api/products"
        );

        if(!response.ok){

            throw new Error(
                "Products API returned HTTP " + response.status
            );

        }

        const data = await response.json();

        if(
            !data.products ||
            !Array.isArray(data.products) ||
            data.products.length === 0
        ){

            throw new Error(
                "No products received from backend"
            );

        }


        /*
         * BACKEND DATABASE ONLY
         *
         * Old hardcoded products are removed.
         * Database products only.
         */

        PRODUCTS = data.products.map(p => {

            const category =
                p.category ||
                p.category_name ||
                "Others";

            return {

                id: Number(p.id),

                name: p.name,

                price: Number(
                    p.final_rate ?? 0
                ),

                offer: Number(
                    p.mrp ?? 0
                ),

                cat: category

            };

        });


        /*
         * PRODUCT ORDER
         *
         * 1 → 2 → 3 → ... → 169
         */

        PRODUCTS.sort(
            (a,b) => Number(a.id) - Number(b.id)
        );


        console.log("================================");
        console.log("PRODUCT LIST LOADED ✅");
        console.log(
            "Backend products:",
            data.products.length
        );
        console.log(
            "Website products:",
            PRODUCTS.length
        );
        console.log("================================");


        /*
         * IMPORTANT
         *
         * Render ONLY after backend data arrives.
         */

        categories();

        render();

        renderCart();

    }

    catch(error){

        console.error(
            "PRODUCT LOAD FAILED ❌",
            error
        );

        /*
         * Do NOT render old products.
         *
         * Backend failed = empty product area.
         */

        PRODUCTS = [];

        categories();

        render();

        renderCart();

    }

}


/* SPARKLES */

function setupSparkles(){

    const box =
        document.getElementById("sparkles");

    if(!box)return;

    for(let i=0;i<65;i++){

        const s =
            document.createElement("span");

        s.className="spark";

        s.style.left =
            Math.random()*100+"%";

        s.style.animationDuration =
            (3+Math.random()*7)+"s";

        s.style.animationDelay =
            (-Math.random()*8)+"s";

        s.style.opacity =
            .2+Math.random()*.7;

        box.appendChild(s);

    }

}


/* CATEGORIES */

function categories(){

    const cats=[

        "All",

        ...new Set(
            PRODUCTS.map(
                p=>p.cat
            )
        )

    ];

    const box =
        document.getElementById("categories");

    if(!box)return;

    box.innerHTML =

        cats.map(c=>`

            <button
                class="cat ${activeCat===c?"active":""}"
                onclick="activeCat='${c}';categories();render()">

                ${c}

            </button>

        `).join("");

}


/* PRODUCTS */

function render(){

    const searchBox =
        document.getElementById("search");

    const q =
        searchBox
        ?
        searchBox.value.toLowerCase().trim()
        :
        "";


    const list =
        PRODUCTS.filter(p =>

            (
                activeCat==="All" ||
                p.cat===activeCat
            )

            &&

            p.name
                .toLowerCase()
                .includes(q)

        );


    const grid =
        document.getElementById("grid");

    if(!grid)return;


    if(!list.length){

        grid.innerHTML =
            '<div class="empty" style="grid-column:1/-1">No crackers found 🔎</div>';

        return;

    }


    grid.innerHTML =

        list.map(p=>`

            <article class="card">

                <span class="badge">
                    OFFER
                </span>


                <div class="productIcon">

                    <img
                        class="productImage"
                        src="images/${p.id}.jpeg"
                        alt="${p.name}"
                        loading="lazy"
                        onerror="handleProductImageError(this, ${p.id})"
                    >


                    <span
                        class="productEmoji"
                        style="display:none">

                        ${icons[p.cat]||"🎇"}

                    </span>

                </div>


                <div class="catname">
                    ${p.cat}
                </div>


                <h3>
                    ${p.name}
                </h3>


                <div class="price">

                    <div>

                        <small
                            style="text-decoration:line-through;">

                            ${money(p.offer)}

                        </small>

                        <br>

                        <b>
                            ${money(p.price)}
                        </b>

                    </div>

                </div>


                <button
                    class="add"
                    onclick="addToCart(${p.id}, this)">

                    + ADD TO CART

                </button>

            </article>

        `).join("");

}


/* PRODUCT IMAGE FALLBACK */

function handleProductImageError(img,id){

    const step =
        Number(
            img.dataset.imageStep || 0
        );


    const extensions = [

        "jpeg",
        "jpg",
        "png",
        "webp"

    ];


    /*
     * Try next image extension
     */

    if(
        step <
        extensions.length - 1
    ){

        const nextStep =
            step + 1;

        img.dataset.imageStep =
            nextStep;

        img.src =
            `images/${id}.${extensions[nextStep]}`;

        return;

    }


    /*
     * All image extensions failed.
     * Show emoji fallback.
     */

    img.style.display="none";


    const fallback =
        img.nextElementSibling;


    if(fallback){

        fallback.style.display="grid";

    }

}


/* CART */

function addToCart(id,buttonEl){

    const product =
        PRODUCTS.find(
            p =>
                Number(p.id) ===
                Number(id)
        );


    if(!product){

        alert("Product not found");

        return;

    }


    const found =
        cart.find(
            x =>
                Number(x.id) ===
                Number(product.id)
        );


    if(found){

        found.qty++;

    }

    else{

        cart.push({

            id:
                Number(product.id),

            name:
                product.name,

            qty:
                1

        });

    }


    /*
     * Save cart
     * Update cart count
     */

    saveCart();


    /*
     * Butterfly animation
     */

    animateButterflyToCart(
        buttonEl
    );


    /*
     * If cart is already open,
     * update cart contents.
     */

    const drawer =
        document.getElementById("drawer");


    if(
        drawer &&
        drawer.classList.contains("open")
    ){

        renderCart();

    }


    /*
     * IMPORTANT:
     *
     * Cart will NOT open automatically.
     */

}


/* ADD TO CART BUTTERFLY ANIMATION */

function animateButterflyToCart(sourceEl){

    if(!sourceEl)return;


    /*
     * Exact cart button
     * from index.html
     */

    const cartButton =
        document.querySelector(
            ".cartbtn"
        );


    if(!cartButton)return;


    const start =
        sourceEl.getBoundingClientRect();


    const end =
        cartButton.getBoundingClientRect();


    /*
     * Create butterfly
     */

    const butterfly =
        document.createElement(
            "div"
        );


    butterfly.textContent="🦋";


    butterfly.style.position="fixed";

    butterfly.style.left =
        `${start.left + start.width/2}px`;

    butterfly.style.top =
        `${start.top + start.height/2}px`;

    butterfly.style.fontSize="28px";

    butterfly.style.zIndex="99999";

    butterfly.style.pointerEvents="none";

    butterfly.style.transform =
        "translate(-50%,-50%)";

    butterfly.style.filter =
        "drop-shadow(0 3px 6px rgba(0,0,0,.3))";


    document.body.appendChild(
        butterfly
    );


    /*
     * Start position
     */

    const startX =
        start.left +
        start.width/2;


    const startY =
        start.top +
        start.height/2;


    /*
     * Cart position
     */

    const endX =
        end.left +
        end.width/2;


    const endY =
        end.top +
        end.height/2;


    /*
     * Middle flying position
     */

    const midX =
        (startX + endX) / 2;


    const midY =
        Math.min(
            startY,
            endY
        ) - 100;


    /*
     * Butterfly animation
     */

    butterfly.animate(

        [

            {

                left:
                    `${startX}px`,

                top:
                    `${startY}px`,

                transform:
                    "translate(-50%,-50%) scale(1)",

                opacity:1

            },


            {

                left:
                    `${midX}px`,

                top:
                    `${midY}px`,

                transform:
                    "translate(-50%,-50%) scale(1.25) rotate(-15deg)",

                opacity:1

            },


            {

                left:
                    `${endX}px`,

                top:
                    `${endY}px`,

                transform:
                    "translate(-50%,-50%) scale(.35) rotate(15deg)",

                opacity:.2

            }

        ],

        {

            duration:1500,

            easing:
                "cubic-bezier(.2,.8,.3,1)"

        }

    );


    /*
     * Cart button small bounce
     */

    setTimeout(()=>{

        cartButton.animate(

            [

                {

                    transform:
                        "scale(1)"

                },

                {

                    transform:
                        "scale(1.15)"

                },

                {

                    transform:
                        "scale(1)"

                }

            ],

            {

                duration:300,

                easing:"ease-out"

            }

        );


        butterfly.remove();

    },750);

}


/* SAVE CART */

function saveCart(){

    localStorage.setItem(

        "vj_cart",

        JSON.stringify(cart)

    );


    const count =
        document.getElementById(
            "cartCount"
        );


    if(count){

        count.textContent =

            cart.reduce(

                (a,b)=>
                    a+b.qty,

                0

            );

    }

}


/* RENDER CART */

function renderCart(){

    const box =
        document.getElementById(
            "cartItems"
        );


    if(!box)return;


    if(!cart.length){

        box.innerHTML =
            '<div class="empty">Your cart is empty 🛒</div>';


        const totalBox =
            document.getElementById(
                "cartTotal"
            );


        if(totalBox){

            totalBox.textContent =
                "₹0";

        }

        return;

    }


    let total=0;


    box.innerHTML =

        cart.map(item=>{

            const p =
                PRODUCTS.find(
                    x =>
                        x.id === item.id
                );


            if(!p)return "";


            const sub =
                p.price *
                item.qty;


            total += sub;


            return `

                <div class="cartitem">

                    <div>

                        <b>
                            ${p.name}
                        </b>

                        <small>
                            ${money(p.price)} each
                        </small>

                    </div>


                    <div class="qty">

                        <button
                            onclick="changeQty(${p.id},-1)">

                            −

                        </button>


                        <b>
                            ${item.qty}
                        </b>


                        <button
                            onclick="changeQty(${p.id},1)">

                            +

                        </button>

                    </div>

                </div>

            `;

        }).join("");


    const totalBox =
        document.getElementById(
            "cartTotal"
        );


    if(totalBox){

        totalBox.textContent =
            money(total);

    }

}


/* CHANGE QUANTITY */

function changeQty(id,d){

    const item =
        cart.find(
            x =>
                x.id === id
        );


    if(!item)return;


    item.qty += d;


    if(item.qty<=0){

        cart =
            cart.filter(
                x =>
                    x.id !== id
            );

    }


    saveCart();

    renderCart();

}


/* OPEN / CLOSE CART */

function openCart(){

    const drawer =
        document.getElementById(
            "drawer"
        );


    if(drawer){

        drawer.classList.add(
            "open"
        );

    }


    renderCart();

}


function closeCart(){

    const drawer =
        document.getElementById(
            "drawer"
        );


    if(drawer){

        drawer.classList.remove(
            "open"
        );

    }

}


/* WHATSAPP ORDER */

async function sendWhatsApp(){

    if(cart.length === 0){

        alert(
            "Your cart is empty."
        );

        return;

    }


    const customerName =
        prompt(
            "Enter your Name:"
        );


    if(
        !customerName ||
        !customerName.trim()
    ){

        alert(
            "Please enter your name."
        );

        return;

    }


    const customerPhone =
        prompt(
            "Enter your Phone Number:"
        );


    if(
        !customerPhone ||
        !customerPhone.trim()
    ){

        alert(
            "Please enter your phone number."
        );

        return;

    }


    const cleanPhone =
        customerPhone.replace(
            /\D/g,
            ""
        );


    if(
        cleanPhone.length < 10
    ){

        alert(
            "Please enter a valid phone number."
        );

        return;

    }


    const city =
        prompt(
            "Enter your City:"
        );


    if(
        !city ||
        !city.trim()
    ){

        alert(
            "Please enter your city."
        );

        return;

    }


    const address =
        prompt(
            "Enter your Delivery Address:"
        );


    if(
        !address ||
        !address.trim()
    ){

        alert(
            "Please enter your delivery address."
        );

        return;

    }


    let total=0;

    const lines=[];

    const orderItems=[];


    for(
        const item of cart
    ){

        /*
         * FIRST:
         * Find product by ID
         */

        let product =
            PRODUCTS.find(
                p =>
                    Number(p.id) ===
                    Number(item.id)
            );


        /*
         * SECOND:
         * If ID mismatch,
         * find by product name
         */

        if(
            !product &&
            item.name
        ){

            const cartName =

                String(item.name)
                    .trim()
                    .toLowerCase();


            product =
                PRODUCTS.find(

                    p =>

                        String(p.name)
                            .trim()
                            .toLowerCase()
                            ===
                            cartName

                );

        }


        if(!product){

            alert(

                "Product not found.\n\n" +

                "Please refresh the page and add the product again."

            );

            return;

        }


        const qty =
            Number(item.qty) || 1;


        const price =
            Number(
                product.price || 0
            );


        const subtotal =
            price * qty;


        total += subtotal;


        lines.push(

            `${product.name} x ${qty} = ₹${subtotal.toFixed(2)}`

        );


        orderItems.push({

            id:
                Number(product.id),

            name:
                product.name,

            qty:
                qty

        });

    }


    /* SAVE ORDER */

    try{

        const response =
            await fetch(

                `${BACKEND_URL}/api/orders`,

                {

                    method:
                        "POST",


                    headers: {

                        "Content-Type":
                            "application/json"

                    },


                    body:
                        JSON.stringify({

                            name:
                                customerName.trim(),

                            phone:
                                customerPhone.trim(),

                            city:
                                city.trim(),

                            address:
                                address.trim(),

                            message:
                                "Website WhatsApp Order",

                            items:
                                orderItems

                        })

                }

            );


        const data =
            await response.json();


        if(!response.ok){

            console.error(

                "ORDER DATABASE ERROR:",

                data

            );


            alert(

                "Database Error:\n\n" +

                (

                    data.error ||

                    data.message ||

                    "Unable to save order."

                )

            );


            return;

        }


        /* WHATSAPP MESSAGE */

        const message =

`\u{1F386} VJS PYRO PARK - NEW ORDER

\u{1F464} Name: ${customerName.trim()}
\u{1F4F1} Phone: ${customerPhone.trim()}
\u{1F3D9}\uFE0F City: ${city.trim()}

\u{1F4CD} Delivery Address:
${address.trim()}

\u{1F6D2} ORDER DETAILS

${lines.join("\n")}

\u{1F4B0} Total: ₹${total.toFixed(2)}

Thank you for choosing VJS Pyro Park! \u{1F386}`;


        const whatsappURL =

            `https://wa.me/${WHATSAPP_NUMBER}?text=` +

            encodeURIComponent(
                message
            );


        /* OPEN WHATSAPP */

        window.location.href =
            whatsappURL;

    }


    catch(error){

        console.error(

            "ORDER ERROR:",

            error

        );


        alert(

            "Unable to connect to server.\n\n" +

            "Please try again."

        );

    }

}


/* START */

setupSparkles();

saveCart();


/* BACKEND */

testBackend();

loadBackendProducts();


/* CONTINUE SHOPPING */

function continueShopping(){

    closeCart();


    const products =
        document.getElementById(
            "products"
        );


    if(products){

        products.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }

}