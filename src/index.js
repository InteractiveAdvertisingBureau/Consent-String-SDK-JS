const { ConsentString } = require('./consent-string');
const { PurposesString } = require('./purposes-string');
const { decodeConsentString } = require('./decode');
const { encodeConsentString } = require('./encode');

module.exports = {
  ConsentString,
  PurposesString,
  decodeConsentString,
  encodeConsentString,
};
