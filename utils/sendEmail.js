import nodemailer from 'nodemailer';

import dotenv from 'dotenv'

dotenv.config()

const FRONT_END_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.FRONT_END_URL
const SMTP_FROM = process.env.SMTP_FROM
const SENDGRID_KEY = process.env.SENDGRID_KEY

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(email, token) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'SendGrid',
    // host: SMTP_HOST,
    // port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: 'apikey',
      pass: SENDGRID_KEY,
    },
  });

  transporter.verify((error, success) => {
    if (error) return console.error(error)

    console.log('Ready to send mail')
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: SMTP_FROM, // sender address
    to: email, // list of receivers
    subject: 'Felix Demo Login', // Subject line
    text: "Your link to login", // plain text body
    html: `<a href='${FRONT_END_URL}/email/${token}'>login</a>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
