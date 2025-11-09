const mongoose = require("mongoose");
// amount,bank_name,interest_rate,maturity,tenures,panno,aadhaar,Nominee_aadhaar,Nominee_phone,Nominee_name,dob
const PersonalSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: [true],
    },
    amount: {
      type: String,
      required: true,
    },
    bank_name: {
      type: String,
      required: true,
    },
    interest_rate: {
      type: String,
      required: true,
    },
    maturity: {
      type: String,
      required: true,
    },
    tenures: {
      type: String,
      required: true,
    },
    panno: {
      type: String,
      required: true,
    },

    aadhaar: {
      type: String,
      required: true,
    },
    Nominee_name: {
      type: String,
      required: true,
    },
    Nominee_phone: {
      type: String,
      required: true,
    },

    Nominee_aadhaar: {
      type: String,
      required: true,
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      require: [true],
    },
  },
  {
    timestamps: true,
  }
);

const PersonalDetails = mongoose.model("PersonalDetail", PersonalSchema);
module.exports = PersonalDetails;
