const handlebars = require('handlebars');

function renderToString(source, userData) {

    const template = handlebars.compile(source);
    const outputString = template(userData);

    
    return outputString;
}

module.exports = renderToString;