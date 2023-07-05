var { expressjwt: expressjwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      // { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      // { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      // { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      // `${api}/users/login`,
      // `${api}/users/register`,
      { url: /(.*)/ },
    ],
  });
}

async function isRevoked(req, payload) {
  console.log(payload);
  if (payload.isAdmin == false) {
    console.log("Not Admin");
    return true;
  }
  console.log("Admin");
  return false;
}
module.exports = authJwt;
