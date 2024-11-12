const nodemailer = require('nodemailer');
const { handleError } = require('./response-utility');

const sendEmail = async (options, res) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
    })

    const mailOptions = {
        from: "Komal <komalp@techoon.in>",
        to: "Komal <komalp@techoon.in>",
        subject: options.subject,
        text: options.message
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        handleError(res, error)
    }
}


module.exports = sendEmail;
