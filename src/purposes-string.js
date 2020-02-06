const { decodePurposesString } = require('./decode');
/**
 * Regular expression for validating
 */
const consentLanguageRegexp = /^[a-z]{2}$/;

class PurposesString {
  /**
   * Initialize a new PurposesString object
   *
   * @param {string} baseString An existing consent string to parse and use for our initial values
   */
  constructor(baseString = null) {
    this.created = new Date();
    this.lastUpdated = new Date();

    /**
     * Version number of consent string specification
     *
     * @type {integer}
     */
    this.version = 1;

    /**
     * The unique ID of the CMP that last modified the consent string
     *
     * @type {integer}
     */
    this.cmpId = null;

    /**
     * Version of the vendor list used for the purposes and vendors
     *
     * @type {integer}
     */
    this.vendorListVersion = null;

    /**
     * Version of the code used by the publisher purposes when collecting consent
     *
     * @type {integer}
     */
    this.publisherPurposeVersion = null;

    /**
     * String containing standard purposes data
     *
     * @type {string}
     */
    this.standardPurposeIdBitString = null;

    /**
     * Amount of custom purposes set by publisher
     *
     * @type {integer}
     */
    this.numCustomPurposes = null;

    /**
     * String containing custom purposes data
     *
     * @type {string}
     */
    this.standardPurposeIdBitString = null;

    // Decode the base string
    if (baseString) {
      Object.assign(this, decodePurposesString(baseString));
    }
  }

  /**
   * Get the version number that this consent string specification adheres to
   *
   * @return {integer} Version number of consent string specification
   */
  getVersion() {
    return this.version;
  }

  /**
   * Get the version of the vendor list
   *
   * @return {integer} Vendor list version
   */
  getVendorListVersion() {
    return this.vendorListVersion;
  }

  /**
   * Get the ID of the Consent Management Platform from the consent string
   *
   * @return {integer}
   */
  getCmpId() {
    return this.cmpId;
  }
}

module.exports = {
    PurposesString,
};
