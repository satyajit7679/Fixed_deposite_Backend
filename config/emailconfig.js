const dotenv=require('dotenv')
dotenv.config()
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host:  'smtp.gmail.com',
    port:  587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'sdlc.group01@gmail.com', // Admin Gmail ID
      pass:'cksp mcqf lkrw givb', // Admin Gmail Password
    },
  })
  
  module.exports= transporter


  