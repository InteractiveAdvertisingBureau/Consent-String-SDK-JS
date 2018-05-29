/* eslint-disable no-unused-expressions */
/**
 * Regular expression for validating
 */
const consentLanguageRegexp = /^[a-z]{2}$/;

export default class Consent {
  /**
   * Initialize a new Consent object
   * @param {Array} vendorList
   * @param {number} cmpId
   * @param {number} cmpVersion
   * @param {number} consentScreen
   * @param {string} consentLanguage
   * @param {Array} purposesAllowed
   * @param {Array} vendorsAllowed
   * @param {string} [null] consentString An existing consent string to parse and use for our initial values
   * @param {Function} encoder
   * @param {Function} decoder
   */
  constructor({
    vendorList,
    cmpId,
    cmpVersion,
    consentScreen,
    consentLanguage,
    purposesAllowed,
    vendorsAllowed,
    consentString = null,
    encoder,
    decoder,
  } = {}) {
    this.created = new Date();
    this.lastUpdated = new Date();

    /**
     * Version number of consent string specification
     *
     * @type {number}
     */
    this.version = 1;

    /**
     * Vendor list with format from https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Draft_for_Public_Comment_Transparency%20%26%20Consent%20Framework%20-%20cookie%20and%20vendor%20list%20format%20specification%20v1.0a.pdf
     *
     * @type {object}
     */
    this.vendorList = null;

    /**
     * Version of the vendor list used for the purposes and vendors
     *
     * @type {number}
     */
    this.vendorListVersion = null;

    /**
     * The unique ID of the CMP that last modified the consent string
     *
     * @type {number}
     */
    this.cmpId = null;

    /**
     * Version of the code used by the CMP when collecting consent
     *
     * @type {number}
     */
    this.cmpVersion = null;

    /**
     * ID of the screen used by CMP when collecting consent
     *
     * @type {number}
     */
    this.consentScreen = null;

    /**
     * Two-letter ISO639-1 code (en, fr, de, etc.) of the language that the CMP asked consent in
     *
     * @type {string}
     */
    this.consentLanguage = null;

    /**
     * List of purpose IDs that the user has given consent to
     *
     * @type {Array[]}
     */
    this.allowedPurposeIds = [];

    /**
     * List of vendor IDs that the user has given consent to
     *
     * @type {Array[]}
     */
    this.allowedVendorIds = [];
    /**
     * Base64 encoder service
     */
    this.encoder = encoder;

    /**
     * Base64 decoder service
     */
    this.decoder = decoder;


    // Decode the base string
    if (consentString) {
      Object.assign(this, this.decoder(consentString));
    } else {
      vendorList && this.setGlobalVendorList(vendorList);
      cmpId && this.setCmpId(cmpId);
      cmpVersion && this.setCmpVersion(cmpVersion);
      consentScreen && this.setConsentScreen(consentScreen);
      consentLanguage && this.setConsentLanguage(consentLanguage);
      purposesAllowed && this.setPurposesAllowed(purposesAllowed);
      vendorsAllowed && this.setVendorsAllowed(vendorsAllowed);
    }
  }

  /**
   * Get the web-safe, base64-encoded consent string
   *
   * @return {string} Web-safe, base64-encoded consent string
   */
  getConsentString(updateDate = true) {
    if (!this.vendorList) {
      throw new Error('ConsentString - A vendor list is required to encode a consent string');
    }

    if (updateDate === true) {
      this.lastUpdated = new Date();
    }

    return this.encoder({
      version: this.getVersion(),
      vendorList: this.vendorList,
      allowedPurposeIds: this.allowedPurposeIds,
      allowedVendorIds: this.allowedVendorIds,
      created: this.created,
      lastUpdated: this.lastUpdated,
      cmpId: this.cmpId,
      cmpVersion: this.cmpVersion,
      consentScreen: this.consentScreen,
      consentLanguage: this.consentLanguage,
      vendorListVersion: this.vendorListVersion,
    });
  }

  /**
   * Get the web-safe, base64-encoded metadata string
   *
   * @return {string} Web-safe, base64-encoded metadata string
   */
  getMetadataString() {
    return this.encoder({
      version: this.getVersion(),
      created: this.created,
      lastUpdated: this.lastUpdated,
      cmpId: this.cmpId,
      cmpVersion: this.cmpVersion,
      consentScreen: this.consentScreen,
      vendorListVersion: this.vendorListVersion,
    });
  }
  /**
   * Get the version number that this consent string specification adheres to
   *
   * @return {number} Version number of consent string specification
   */
  getVersion() {
    return this.version;
  }

  /**
   * Get the version of the vendor list
   *
   * @return {number} Vendor list version
   */
  getVendorListVersion() {
    return this.vendorListVersion;
  }

  /**
   * Set the vendors list to use when generating the consent string
   *
   * The expected format is the one from https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Draft_for_Public_Comment_Transparency%20%26%20Consent%20Framework%20-%20cookie%20and%20vendor%20list%20format%20specification%20v1.0a.pdf
   *
   * @param {object} vendorList Vendor list with format from https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Draft_for_Public_Comment_Transparency%20%26%20Consent%20Framework%20-%20cookie%20and%20vendor%20list%20format%20specification%20v1.0a.pdf
   */
  setGlobalVendorList(vendorList) {
    if (typeof vendorList !== 'object') {
      throw new Error('ConsentString - You must provide an object when setting the global vendor list');
    }

    if (
      !vendorList.vendorListVersion
      || !Array.isArray(vendorList.purposes)
      || !Array.isArray(vendorList.vendors)
    ) {
      // The provided vendor list does not look valid
      throw new Error('ConsentString - The provided vendor list does not respect the schema from the IAB EU’s GDPR Consent and Transparency Framework');
    }

    // Cloning the GVL
    // It's important as we might transform it and don't want to modify objects that we do not own
    this.vendorList = {
      vendorListVersion: vendorList.vendorListVersion,
      lastUpdated: vendorList.lastUpdated,
      purposes: vendorList.purposes,
      features: vendorList.features,

      // Clone the list and sort the vendors by ID (it breaks our range generation algorithm if they are not sorted)
      vendors: vendorList.vendors
        .slice(0)
        .sort((firstVendor, secondVendor) => (firstVendor.id < secondVendor.id ? -1 : 1)),
    };
    this.vendorListVersion = vendorList.vendorListVersion;
  }

  /**
   * Set the ID of the Consent Management Platform that last modified the consent string
   *
   * Every CMP is assigned a unique ID by the IAB EU that must be provided here before changing any other value in the consent string.
   *
   * @param {number} id CMP ID
   */
  setCmpId(id) {
    this.cmpId = id;
  }

  /**
   * Get the ID of the Consent Management Platform from the consent string
   *
   * @return {number}
   */
  getCmpId() {
    return this.cmpId;
  }

  /**
   * Set the version of the Consent Management Platform that last modified the consent string
   *
   * This version number references the CMP code running when collecting the user consent.
   *
   * @param {number} version Version
   */
  setCmpVersion(version) {
    this.cmpVersion = version;
  }

  /**
   * Get the verison of the Consent Management Platform that last modified the consent string
   *
   * @return {number}
   */
  getCmpVersion() {
    return this.cmpVersion;
  }

  /**
   * Set the Consent Management Platform screen ID that collected the user consent
   *
   * This screen ID references a unique view in the CMP that was displayed to the user to collect consent
   *
   * @param {*} screenId Screen ID
   */
  setConsentScreen(screenId) {
    this.consentScreen = screenId;
  }

  /**
   * Get the Consent Management Platform screen ID that collected the user consent
   *
   * @return {number}
   */
  getConsentScreen() {
    return this.consentScreen;
  }

  /**
   * Set the language that the CMP asked the consent in
   *
   * @param {string} language Two-letter ISO639-1 code (en, fr, de, etc.)
   */
  setConsentLanguage(language) {
    if (consentLanguageRegexp.test(language) === false) {
      throw new Error('ConsentString - The consent language must be a two-letter ISO639-1 code (en, fr, de, etc.)');
    }

    this.consentLanguage = language;
  }

  /**
   * Get the language that the CMP asked consent in
   *
   * @return {string} Two-letter ISO639-1 code (en, fr, de, etc.)
   */
  getConsentLanguage() {
    return this.consentLanguage;
  }

  /**
   * Set the list of purpose IDs that the user has given consent to
   *
   * @param {number[]} purposeIds An array of integers that map to the purposes defined in the vendor list. Purposes included in the array are purposes that the user has given consent to
   */
  setPurposesAllowed(purposeIds) {
    this.allowedPurposeIds = purposeIds;
  }

  /**
   * Get the list of purpose IDs that the user has given consent to
   *
   * @return {Array[]}
   */
  getPurposesAllowed() {
    return this.allowedPurposeIds;
  }

  /**
   * Set the consent status of a user for a given purpose
   *
   * @param {number} purposeId The ID (from the vendor list) of the purpose to update
   * @param {boolean} value Consent status
   */
  setPurposeAllowed(purposeId, value) {
    const purposeIndex = this.allowedPurposeIds.indexOf(purposeId);

    if (value === true) {
      if (purposeIndex === -1) {
        this.allowedPurposeIds.push(purposeId);
      }
    } else if (value === false) {
      if (purposeIndex !== -1) {
        this.allowedPurposeIds.splice(purposeIndex, 1);
      }
    }
  }

  /**
   * Check if the user has given consent for a specific purpose
   *
   * @param {number} purposeId
   *
   * @return {boolean}
   */
  isPurposeAllowed(purposeId) {
    return this.allowedPurposeIds.indexOf(purposeId) !== -1;
  }

  /**
   * Set the list of vendor IDs that the user has given consent to
   *
   * @param {Array[]} vendorIds An array of integers that map to the vendors defined in the vendor list. Vendors included in the array are vendors that the user has given consent to
   */
  setVendorsAllowed(vendorIds) {
    this.allowedVendorIds = vendorIds;
  }

  /**
   * Get the list of vendor IDs that the user has given consent to
   *
   * @return {Array[]}
   */
  getVendorsAllowed() {
    return this.allowedVendorIds;
  }

  /**
   * Set the consent status of a user for a given vendor
   *
   * @param {integer} vendorId The ID (from the vendor list) of the vendor to update
   * @param {boolean} value Consent status
   */
  setVendorAllowed(vendorId, value) {
    const vendorIndex = this.allowedVendorIds.indexOf(vendorId);

    if (value === true) {
      if (vendorIndex === -1) {
        this.allowedVendorIds.push(vendorId);
      }
    } else if (value === false) {
      if (vendorIndex !== -1) {
        this.allowedVendorIds.splice(vendorIndex, 1);
      }
    }
  }

  /**
   * Check if the user has given consent for a specific vendor
   *
   * @param {number} vendorId
   *
   * @return {boolean}
   */
  isVendorAllowed(vendorId) {
    return this.allowedVendorIds.indexOf(vendorId) !== -1;
  }
}
