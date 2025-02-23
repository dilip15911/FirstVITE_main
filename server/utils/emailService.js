const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,           // 465 for secure connection; agar 587 use karna ho to secure: false karein
  secure: true,        // true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Use app-specific password
  },
  debug: true,         // Enable debug logging
  logger: true,        // Enable built-in logger
});

// Send verification email
const sendVerificationEmail = async (email, name, verificationCode) => {
  console.log('Attempting to send verification email:', {
    to: email,
    from: process.env.EMAIL_USER,
    name,
    codeLength: verificationCode?.length,
  });

  const mailOptions = {
    from: `"FirstVITE Support Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Our Platform!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please use the following verification code to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          <strong>${verificationCode}</strong>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <p>Best regards,<br> FirstVITE Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
    });
    return true;
  } catch (error) {
    console.error('Error sending verification email:', {
      error: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack,
    });
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, code) => {
  console.log('Attempting to send password reset email:', {
    to: email,
    from: process.env.EMAIL_USER,
    codeLength: code?.length,
  });

  const mailOptions = {
    from: `"FirstVITE Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Password Reset</h1>
        <p>You have requested to reset your password. Please use the following code:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
          <h2 style="color: #4a90e2; margin: 0; font-size: 24px;">${code}</h2>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated message, please do not reply.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
    });
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', {
      error: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack,
    });
    throw error;
  }
};

// Verify the transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', {
      error: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack,
    });
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};




// const nodemailer = require('nodemailer');

// // Create reusable transporter object using SMTP transport
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_APP_PASSWORD // Use app-specific password
//   },
//   debug: true, // Enable debug logging
//   logger: true // Enable built-in logger
// });

// // Send verification email
// const sendVerificationEmail = async (email, name, verificationCode) => {
//   console.log('Attempting to send verification email:', {
//     to: email,
//     from: process.env.EMAIL_USER,
//     name: name,
//     codeLength: verificationCode?.length
//   });

//   const mailOptions = {
//     from: `"FirstVITE Support Team" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: 'Verify Your Email',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2>Welcome to Our Platform!</h2>
//         <p>Hi ${name},</p>
//         <p>Thank you for registering. Please use the following verification code to verify your email address:</p>
//         <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
//           <strong>${verificationCode}</strong>
//         </div>
//         <p>This code will expire in 10 minutes.</p>
//         <p>If you didn't request this verification, please ignore this email.</p>
//         <p>Best regards,<br> FirstVITE Team</p>
//       </div>
//     `
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Verification email sent successfully:', {
//       messageId: info.messageId,
//       response: info.response
//     });
//     return true;
//   } catch (error) {
//     console.error('Error sending verification email:', {
//       error: error.message,
//       code: error.code,
//       command: error.command,
//       stack: error.stack
//     });
//     throw error;
//   }
// };

// const sendPasswordResetEmail = async (email, code) => {
//   console.log('Attempting to send password reset email:', {
//     to: email,
//     from: process.env.EMAIL_USER,
//     codeLength: code?.length
//   });

//   try {
//     const mailOptions = {
//       from: `"FirstVITE Support" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Password Reset Code',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h1 style="color: #333; text-align: center;">Password Reset</h1>
//           <p>You have requested to reset your password. Please use the following code:</p>
//           <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
//             <h2 style="color: #4a90e2; margin: 0; font-size: 24px;">${code}</h2>
//           </div>
//           <p>This code will expire in 10 minutes.</p>
//           <p>If you didn't request this reset, please ignore this email.</p>
//           <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated message, please do not reply.</p>
//         </div>
//       `,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log('Password reset email sent successfully:', {
//       messageId: info.messageId,
//       response: info.response
//     });
//     return true;
//   } catch (error) {
//     console.error('Error sending password reset email:', {
//       error: error.message,
//       code: error.code,
//       command: error.command,
//       stack: error.stack
//     });
//     throw error;
//   }
// };

// // Verify the transporter connection on startup
// transporter.verify(function (error, success) {
//   if (error) {
//     console.error('Email transporter verification failed:', {
//       error: error.message,
//       code: error.code,
//       command: error.command,
//       stack: error.stack
//     });
//   } else {
//     console.log('Email server is ready to send messages');
//   }
// });

// module.exports = {
//   sendVerificationEmail,
//   sendPasswordResetEmail,
// };
