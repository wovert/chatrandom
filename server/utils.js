const moment = require('moment');

var generateMessage = (author, message) => {
  return { 
    author, 
    message, 
    timeStamp: moment(new Date()).format('LT') };
}

module.exports = {
  generateMessage
}