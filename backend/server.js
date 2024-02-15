require("dotenv").config();
const express = require("express");
const cors = require("cors");

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PORT = 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/info", (req, res) => {
  res.json("Hello 👋");
});

app.post("/pay", async (req, res) => {
  try {
    const { name, userId, amount } = req.body;

    if (!name) return res.status(400).json({ message: "Please enter a name" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "LKR",
      payment_method_types: ["card"],
      metadata: { name: name, userId: userId },
    });

    const clientSecret = paymentIntent.client_secret;
    res.json({ message: "Payment initiated", clientSecret });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal sever error" });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
