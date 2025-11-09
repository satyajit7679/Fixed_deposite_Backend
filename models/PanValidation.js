const express = require('express');
const router = express.Router();

// PAN Number validation regex (Indian PAN card format)
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

// Static PAN number (for verification)
const validStaticPan = 'ABCDE1234F'; // Replace this with your real value

// PAN Validation Route
router.post('/PanValidation', (req, res) => {
  const { panNumber } = req.body;

  // First check if PAN number format is valid
  if (!panRegex.test(panNumber)) {
    return res.status(400).json({ error: 'Invalid PAN number format' });
  }

  // Then check if it matches the static PAN number
  if (panNumber === validStaticPan) {
    return res.status(200).json({ message: 'PAN number is valid and matched' });
    
  } else {
    return res.status(401).json({ error: 'PAN number is valid but not authorized' });
  }
});

module.exports = router;
