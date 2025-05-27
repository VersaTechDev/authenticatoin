//const { MailtrapClient } = require("mailtrap");
/*
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config() ;
//const TOKEN = "db48c8483376ffcb3afe6014431d897a";
//const TOKEN = process.env.MAILTRAP_TOKEN ;

const client = new MailtrapClient({
  //token: TOKEN,
  token : process.env.MAILTRAP_TOKEN ,
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "Vikrant Kumar",
};
const recipients = [
  {
    email: "vikrantcloud6@gmail.com",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "Test the email form vikrant kumar!",
    // at text part we also write a html file aur code 
    text: "This email is for testing purpose , so ignore it!",
    category: "Integration Test",
  })
  .then(console.log, console.error);
 */
// the above code wirtten is static we need to wrtie in dynamic part so ..

import { MailtrapClient } from "mailtrap";
import dotenv from 'dotenv';
dotenv.config();

export const mailtrapClient = new MailtrapClient({

  token : process.env.MAILTRAP_TOKEN ,

});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Vikrant kumar",
};
