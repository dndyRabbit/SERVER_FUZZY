const { google } = require("googleapis");
const keys = require("../credentials/lian-fuzzy.json");

const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  process.env.GOOGLE_APIS,
]);

client.authorize((err, tokens) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Connected to SPREADSHEET!");
  }
});

const gsapi = google.sheets({ version: "v4", auth: client });

module.exports = gsapi;
