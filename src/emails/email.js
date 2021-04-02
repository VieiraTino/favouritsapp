const sgMail = require('@sendgrid/mail');

const fs = require('fs');
const path = require('path');
const hbs = require('hbs');

const renderToString = require('../utils/compileHTML')

const sendgridAPIKey = process.env.sendgrid_api_key;
sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeMail = async (userData) => {
  let emailData = {}
  let fileMail = fs.readFileSync(path.join(__dirname + '/templates/welcomeMail.hbs'));

  emailData['to'] = userData.email;
  emailData['from'] = "yanaramalho88@gmail.com";
  emailData['subject'] = "Registo na aplicação dos teus filmes favoritos";
  emailData['text'] = "Olá, " + userData.username + ".</br>Este é o texto do text";
  emailData['html'] = renderToString(fileMail.toString(), userData);

  sendEmail(emailData);
};

const sendFavouritesMail = async (userData, renderData) => {

  let emailData = {}
  const fileMail = fs.readFileSync(path.join(__dirname + '/templates/favouritesMail.hbs'));
  let cardMail = fs.readFileSync(path.join(__dirname + '/templates/favouriteCard.hbs'));
  let cardsCompiled = '';

  for (const element of renderData) {
    dataToCompile = {
      userMovieName: element.userMovieName,
      idOnTMDB: element.idOnTMDB,
      ...element.tmdbData
    }

    renderedCard = renderToString(cardMail.toString(), dataToCompile).toString()
    cardsCompiled = cardsCompiled.concat(renderedCard);
  }

  userData['favouriteCards'] = cardsCompiled;

  emailData['to'] = userData.email;
  emailData['from'] = "yanaramalho88@gmail.com";
  emailData['subject'] = "Registo na aplicação dos teus filmes favoritos";
  emailData['text'] = "Olá, " + userData.username + ".</br>Este é o texto do text";
  emailData['html'] = renderToString(fileMail.toString(), userData);

  sendEmail(emailData);
};

const sendCancelMail = async (userData) => {
  let emailData = {}
  let fileMail = fs.readFileSync(path.join(__dirname + '/templates/cancelMail.hbs'));

  emailData['to'] = userData.email;
  emailData['from'] = "yanaramalho88@gmail.com";
  emailData['subject'] = "Registo na aplicação dos teus filmes favoritos";
  emailData['text'] = "Olá, " + userData.username + ".</br>Este é o texto do text";
  emailData['html'] = renderToString(fileMail.toString(), userData);

  sendEmail(emailData);
};

const sendEmail = (emailData) => {
  sgMail.send(emailData);
}

module.exports = {
  sendWelcomeMail,
  sendFavouritesMail,
  sendCancelMail
};