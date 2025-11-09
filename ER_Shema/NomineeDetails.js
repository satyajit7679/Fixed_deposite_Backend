const nomineeSchema = new mongoose.Schema(
  {
    FD_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FixedDeposit",
      required: true,
    },
    nominee_name: { type: String, required: true },
    nominee_phone: { type: Number, required: true },
    nominee_aadhar: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nominee", nomineeSchema);
