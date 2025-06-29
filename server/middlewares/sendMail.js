import nodemailer from 'nodemailer';

const sendMail = async (email, subject, content) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    try {
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: content
        };
        const info = await transporter.sendMail(mailOptions);
        if (process.env.NODE_ENV !== 'production') {
            if (info && info.messageId) {
                console.log('Email sent: ' + info.messageId);
            } else {
                console.log('Email sent, but message ID not available.');
            }
        }
        return info;
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(error);
        }
        throw error;
    }
}

export default sendMail;