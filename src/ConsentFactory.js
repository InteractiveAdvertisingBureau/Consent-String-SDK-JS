import Consent from './Consent';

/**
 * @class
 */
export default class ConsentFactory {
  constructor({ encoder, decoder }) {
    this.encoder = encoder;
    this.decoder = decoder;
  }

  /**
   * Creates a Consent object with given parameters
   * @param {Array} vendorList
   * @param {number} cmpId
   * @param {number} cmpVersion
   * @param {number} consentScreen
   * @param {string} consentLanguage
   * @param {Array} purposesAllowed
   * @param {Array} vendorsAllowed
   * @returns {Consent}
   */
  create({
    vendorList,
    cmpId,
    cmpVersion,
    consentScreen,
    consentLanguage,
    purposesAllowed,
    vendorsAllowed,
  }) {
    return new Consent({
      vendorList,
      cmpId,
      cmpVersion,
      consentScreen,
      consentLanguage,
      purposesAllowed,
      vendorsAllowed,
      encoder: this.encoder,
      decoder: this.decoder,
    });
  }

  /**
   * Creates a Consent object from a base64 encoded data
   * @param {string} base64EncodedString
   * @returns {Consent}
   */
  createFromEncodedBase64String({ base64EncodedString }) {
    return new Consent({
      consentString: base64EncodedString,
      encoder: this.encoder,
      decoder: this.decoder,
    });
  }
}
