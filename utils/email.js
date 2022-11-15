const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.from = process.env.SENDGRID_VERIFIED_SENDER
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.title = user.title
    this.url = url
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid
      return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      })
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    })
    const mailOptions = {
      from: `Utku Onur Şahin <${this.from}>`,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    }
    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {await this.send('welcome', "Başkent DSC'ye Hoşgeldin")}
  async sendPasswordReset() {await this.send('passwordReset', 'Şifre Sıfırlama Bağlantısı')}
}