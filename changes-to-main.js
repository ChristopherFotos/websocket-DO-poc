const { exec } = require("child_process");
const crypto = require("crypto");

const verifySignature = (req, secret) => {
  const signature = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex")}`;

  return req.headers["x-hub-signature-256"] === signature;
};

const handleWebhook = (req, res) => {
  const secret = ".Uu=AZs1itJ|2&id8_}I~C~!3:Fpkt"; // Replace with env variable
  if (!verifySignature(req, secret)) {
    return res.status(403).send("Invalid signature");
  }

  const branch = req.body.ref;

  if (branch === "refs/heads/main") {
    exec(
      "git pull && npm install && pm2 restart all",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return res.status(500).send("Error updating app");
        }
        console.log(`Output: ${stdout}`);
        console.error(`Error Output: ${stderr}`);
        res.status(200).send("App updated successfully");
      }
    );
  } else {
    res.status(200).send("No action taken");
  }
};

module.exports = handleWebhook;
