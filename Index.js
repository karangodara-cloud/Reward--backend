const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const serviceAccount = require("./firebase-config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
});

const db = admin.database();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/postback", async (req, res) => {
  const { uid, coins } = req.body;
  if (!uid || !coins) return res.status(400).send("Missing data");

  await db.ref("users/" + uid + "/coins").transaction((curr) => (curr || 0) + coins);
  res.send("Coins updated");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
