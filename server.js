require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT;

app.post("/pay", async (req, res) => {
  const { amount, phone } = req.body;

  try {
    const tokenResponse = await axios.post(
      `${process.env.MOMO_COLLECTION_URL}/collection/token/`,
      {},
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.MOMO_SUBSCRIPTION_KEY,
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.MOMO_API_USER +
                ":" +
                process.env.MOMO_API_KEY
            ).toString("base64"),
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    await axios.post(
      `${process.env.MOMO_COLLECTION_URL}/collection/v1_0/requesttopay`,
      {
        amount: amount,
        currency: "EUR",
        externalId: "12345",
        payer: {
          partyIdType: "MSISDN",
          partyId: phone,
        },
        payerMessage: "Ruli Dell Shop Payment",
        payeeNote: "Thanks for shopping",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Reference-Id": "123456789",
          "X-Target-Environment": "sandbox",
          "Ocp-Apim-Subscription-Key":
            process.env.MOMO_SUBSCRIPTION_KEY,
          "Content-Type": "application/json",
        },
      }app.get("/", (req, res) => {
  res.send("Server is working");
});

    );

    res.json({ message: "Payment request sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Payment failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
