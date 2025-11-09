const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const connectDB = require("./db"); // Import the database connection function
const User = require("./schema/userSchema"); // Import the User model
const router = require("./routes/userRoutes");
const app = express();
//const authRoutes = require('./routes/auth');
const port = 3001;
//const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middlewire/authenticateToken");
const Razorpay = require("razorpay");
const Transaction = require("./models/Transaction");
//const authenticateToken = require('./middlewire/authenticateToken');
const personalDetailsRoute = require("./routes/personalDetailsRoute");
const panValidationRoute = require("./models/PanValidation");
const PersonalDetails = require("./models/PersonalDetails");
const transporter = require("./config/emailconfig");
const contact = require("./models/contact");

const users = [];

var instance = new Razorpay({
  key_id: "rzp_test_FnBeGoJAHlye2h",
  key_secret: "NOBWohePdMcLaWNvwDetMT3q",
});

// Fix body-parser deprecation warning
app.use(express.urlencoded({ extended: true })); // Add { extended: true }
app.use(express.json());

app.use(
  cors({
    origin: "*", // Add your frontend ports
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", panValidationRoute);
app.use("/api", personalDetailsRoute);
//app.use("/api", require("./routes/auth"));
app.use("/abc", router);
//app.use('/api', authRoutes);
connectDB(); // Connect to the database

app.get("/users3", async (req, res) => {
  try {
    console.log("printed");
    const userList = await User.find({});
    console.log("userList", userList);
    res.status(201).json(userList);
  } catch (error) {
  } finally {
    console.log("printed again");
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await PersonalDetails.find().populate("userid");
    console.log(users); // Fetch users from MongoDB
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

app.post("/create-order", (req, res) => {
  const options = {
    amount: req.body.amount, // Amount is in paise
    currency: "INR",
    receipt: `order_rcptid_${Math.ceil(Math.random() * 900)}`,
  };

  // console.log("options", options);

  instance.orders.create(options, function (err, order) {
    if (err) {
      console.log("err", err);
      return res.status(500).json({ error: "Order creation failed" });
    }

    console.log("order", order);

    const payload = {};
    if (order) {
      payload.orderId = order?.id;
    }

    return res.status(200).json({ data: payload });
  });
});

app.post("/verify-payment", authenticateToken, async (req, res) => {
  const user = req.user;
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
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

  const key_secret =
    process.env.RAZORPAY_KEY_SECRET || "NOBWohePdMcLaWNvwDetMT3q";
  const generated_signature = crypto
    .createHmac("sha256", key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  try {
    const datasave = await new PersonalDetails({
      userid: user.id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
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
    }).save();
    if (!datasave) {
      return res.status(400).json({ message: "Wait Error Occurd" });
    }
    const info = await transporter.sendMail({
      from: '"DHEERAONE" <sdlc.group01@gmail.com>',
      to: user.email,
      subject: "FD Creation Successful",
      html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>FD Creation Confirmation</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #1a73e8;
            padding: 20px;
            color: white;
            text-align: center;
          }
          .content {
            padding: 30px;
          }
          .content p, .content ul {
            font-size: 16px;
            line-height: 1.6;
          }
          .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #1a73e8;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          }
          .footer {
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #999999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Fixed Deposit Created Successfully</h2>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>We are pleased to inform you that your Fixed Deposit (FD) has been successfully created with the following details:</p>
            <ul>
              <li><strong>Bank Name:</strong> ${bank_name}</li>
              <li><strong>Amount:</strong> ₹${amount}</li>
              <li><strong>Interest Rate:</strong> ${interest_rate}%</li>
              <li><strong>Tenure:</strong> ${tenures} months</li>
              <li><strong>Maturity Amount:</strong> ₹${maturity}</li>
            </ul>
            <p>You can view or manage your deposit anytime from your dashboard.</p>
            <a href="http://localhost:5174/FDPortfolio" class="btn">Go to Dashboard</a>
            <p>If you did not initiate this transaction, please contact our support team immediately.</p>
            <p>Best regards,<br />DHEERAONE Finance Team</p>
          </div>
          <div class="footer">
            &copy; 2025 DHEERAONE. All rights reserved.
          </div>
        </div>
      </body>
    </html>`,
    });

    return res
      .status(200)
      .json({ message: "Payment verified and transaction saved" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Payment verified but failed to store transaction" });
  }
});

app.post("/sign-up", async (req, res) => {
  try {
    const { name, email, password, phone, dob, address } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !dob || !address) {
      return res.status(400).json({
        message: "Name, email,phone number, password,dob,address are required.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already in use. Please use a different email.",
      });
    }

    // Create new user
    const createdUser = await new User({
      name,
      email,
      password: hashedPassword,
      phone,
      dob,
      address,
    }).save();

    console.log(createdUser);
    if (createdUser) {
      return res
        .status(201)
        .json({ message: "User added successfully", data: createdUser });
    }
    return res.status(201).json({ message: "errr" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const token = generateAccessToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });

    // ✅ Send user data along with token
    return res.status(200).json({
      message: "user logged in successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  }

  return res.status(404).json({ message: "wrong password" });
});

app.get("/update-profile", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const userdata = await User.findOne({
      _id: user.id,
    });
    return res.status(200).json({
      message: "Data Fetch Sucessfully",
      Udata: userdata,
    });
  } catch (err) {
    res.status(400).json({
      message: "Profil Not Found",
    });
  }
});

app.get("/profile", authenticateToken, async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (user) {
    res.status(200).json({ data: user });
  }
  console.log("profile called");
});
app.get("/sign-up", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email avatar");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: error.message });
  }
});

app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email }).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ data: user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/user/:id", async (req, res) => {
  const id = req.params.id;
  const updateduser = await User.findById(id);
  if (!updateduser) {
    return res.status(404).json({ message: "user not found" });
  }
  const { name, password, email } = req.body;
  updateduser.name = name;
  updateduser.email = password;
  updateduser.email = email;
  await updateduser.save();
  res.json({ message: "user updated successfully", data: updateduser });
});

app.post("/PersonalDetails", (req, res) => {
  const data = req.body;
  console.log("Received Data:", data);
  // You can store it in MongoDB here
  res.status(200).json({ message: "Data received successfully" });
});

app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});
app.post("/contact-data-store", async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, message } = req.body;

    const data = {
      name,
      email,
      message,
    };
    const contactdata = await contact.create(data);
    if (contactdata) {
      return res.status(200).json({
        message:
          "Thank you for contacting us! Our team will get in touch with you shortly",
      });
    }

    return res
      .status(400)
      .json({ message: "Error Please Try After Some Time" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message, error });
  }
});
app.get("/contact-data", async (req, res) => {
  try {
    const contactdata = await contact.find({ isdelete: false });
    console.log(contactdata);
    if (contactdata) {
      return res.status(200).json({
        message:
          "Thank you for contacting us! Our team will get in touch with you shortly",
        data: contactdata,
      });
    }

    return res
      .status(400)
      .json({ message: "Error Please Try After Some Time" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message, error });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function generateAccessToken(payload) {
  return jwt.sign(payload, "BCA", { expiresIn: "2h" });
}
