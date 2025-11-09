const kycSchema = new mongoose.Schema(
  {
    FD_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FixedDeposit",
      required: true,
    },
    Pan_no: { type: String, required: true },
    Aadhar_no: { type: Number, required: true },
    DOB: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerKYC", kycSchema);
