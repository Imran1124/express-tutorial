const nodeMailer = require('nodemailer');

const mailer = async (to, text, subject, html) => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD
    }
  });

  let info = await transporter.sendMail({
    from: 'chandankumar6299068@gmail.com', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html // html body
  });
  return info;
};

module.exports = mailer;
