import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();
const emailService = async (receiverEmail) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_LOGIN, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: receiverEmail, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>', // html body
    });
};

export default emailService;
