require("dotenv").config();

const http = require("http");

const data = JSON.stringify({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
});

const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/login",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {

    let body = "";

    res.on("data", chunk => {
        body += chunk;
    });

    res.on("end", () => {
        console.log("");
        console.log("STATUS:", res.statusCode);
        console.log("RESPONSE:", body);
        console.log("");
    });
});

req.on("error", error => {
    console.error("LOGIN TEST FAILED:", error.message);
});

req.write(data);
req.end();