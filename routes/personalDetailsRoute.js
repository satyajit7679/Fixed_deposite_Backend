const express = require("express");
const router = express.Router();
const PersonalDetails = require("../models/PersonalDetails");
const authenticateToken = require("../middlewire/authenticateToken");
const { default: mongoose } = require("mongoose");
const User = require("../schema/userSchema");

// POST route to save form data
router.post("/PersonalDetails", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const {
      amount,
      bank_name,
      interest_rate,
      maturity,
      tenures,
      panno,
      aadhaar,
      Nominee_aadhaar,
      Nominee_phone,
      Nominee_name,
      dob,
    } = req.body;
    const detail = new PersonalDetails({
      userid: user.id,
      amount,
      bank_name,
      interest_rate,
      maturity,
      tenures,
      panno,
      aadhaar,
      Nominee_aadhaar,
      Nominee_phone,
      Nominee_name,
      dob,
    });
    await detail.save();

    res.status(201).json({ message: "Details saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/PersonalDetailsget", authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    const data = await User.findOne({ _id: user.id });

    console.log(data);

    res.status(201).json({ message: "Details saved successfully", data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
router.get("/fdPortfolioget", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const id = user.id;
    const data = await PersonalDetails.find({ userid: id });

    res.status(201).json({ message: "Details fetch successfully", data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
