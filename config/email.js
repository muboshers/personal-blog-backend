import hbs from "nodemailer-express-handlebars";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "muboshermuydinov094@gmail.com",
    pass: process.env.GMAIL_KEY,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve(__dirname, "../views"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "../views"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(handlebarOptions));

export const sendMessageEmaillSubscription = (email) => {
  let mailOptions = {
    from: "youremail@gmail.com",
    to: email,
    subject: "Your email has been received",
    template: "subscribe-newsletter",
    context: {
      email,
    },
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const sendContactMessageEmail = (email, title, message) => {
  let mailOptions = {
    from: "youremail@gmail.com",
    to: email,
    subject: title,
    template: "contact-message",
    context: {
      email,
      message,
    },
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
