const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("./private.key");
const payload = {
  partnerId: "2b5b4b24-0f2f-4d1b-a7b2-39db2504589f",
  scope: "issue verify",
  // other claims as needed
  exp: Math.floor(Date.now() / 1000) + 5 * 600000 // 5 minutes expiry
};

const token = jwt.sign(payload, privateKey, {
  algorithm: "RS256",
  header: {
    kid: "my-key-1"
  }
});
console.log(token);
