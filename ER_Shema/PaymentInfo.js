const paymentSchema = new mongoose.Schema(
  {
    FD_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FixedDeposit",
      required: true,
    },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentInfo", paymentSchema);
