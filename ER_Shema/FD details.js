const fdSchema = new mongoose.Schema(
  {
    amount: { type: String, required: true },
    bank_name: { type: String, required: true },
    interest_rate: { type: String, required: true },
    maturity: { type: String, required: true },
    tenures: { type: String, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FixedDeposit", fdSchema);
