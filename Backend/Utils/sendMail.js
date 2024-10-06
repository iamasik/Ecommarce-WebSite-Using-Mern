import nodemailer from 'nodemailer'
import catchAsyncError from './catchAsyncError.js';

const sendEmail =catchAsyncError( async (options) => {
  
    const transport = nodemailer.createTransport({
      host: process.env.MAIL_TRAP_HOST,
      port: 25,
      auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASS
      }
    })
    
    const message = {
      from: `${process.env.MAIL_TRAP_NAME} <${process.env.MAIL_TRAP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.message
    };
  
    await transport.sendMail(message);
  })

  export default sendEmail