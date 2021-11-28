import nodemailer from 'nodemailer';
import { NODE_ENV, SMTP_HOST, SMTP_FROM, SMTP_PW } from '../src/config.js';

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(email, token) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  const dev = NODE_ENV === 'development'
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: dev ? 'smtp.ethereal.email' : SMTP_HOST,
    port: dev ? 587 : 465,
    secure: dev ? false : true, // true for 465, false for other ports
    auth: {
      user: dev ? testAccount.user : SMTP_FROM, // generated ethereal user
      pass: dev ? testAccount.pass : SMTP_PW, // generated ethereal password
    },
  });

  transporter.verify((error, success) => {
    if (error) return console.error(error)

    console.log('Ready to send mail')
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: dev ? '"Fred Foo 👻" <foo@example.com>' : SMTP_FROM, // sender address
    to: email, // list of receivers
    subject: 'Felix Demo Login', // Subject line
    text: "Your link to login", // plain text body
    html: `<a href='http://localhost:3000/email/${token}'>login</a>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
