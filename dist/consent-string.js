'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./encode'),
    encodeConsentString = _require.encodeConsentString,
    _getMaxVendorId = _require.getMaxVendorId,
    encodeVendorIdsToBits = _require.encodeVendorIdsToBits,
    encodePurposeIdsToBits = _require.encodePurposeIdsToBits;

var _require2 = require('./decode'),
    decodeConsentString = _require2.decodeConsentString;

var _require3 = require('./utils/definitions'),
    vendorVersionMap = _require3.vendorVersionMap;
/**
 * Regular expression for validating
 */


var consentLanguageRegexp = /^[a-z]{2}$/;
var cachedString = void 0;

var ConsentString = function () {
  function ConsentString() {
    var baseString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, ConsentString);

    this.maxVendorId = 0;
    this.created = new Date();
    this.lastUpdated = new Date();
    this.version = 1;
    this.vendorList = null;
    this.vendorListVersion = null;
    this.cmpId = null;
    this.cmpVersion = null;
    this.consentScreen = null;
    this.consentLanguage = null;
    this.allowedPurposeIds = [];
    this.allowedVendorIds = [];

    // Decode the base string
    if (baseString) {
      cachedString = baseString;
      Object.assign(this, decodeConsentString(baseString));
    }
  }

  _createClass(ConsentString, [{
    key: 'getConsentString',
    value: function getConsentString() {
      var updateDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var retr = void 0;

      /**
       * check for cached string that was passed in.  This avoids having to
       * decode the consent string and even to have a vendorlist
       */
      if (cachedString && !updateDate) {
        retr = cachedString;
      } else {
        if (!this.vendorList) {
          throw new Error('ConsentString - A vendor list is required to encode a consent string');
        }

        if (updateDate === true) {
          this.lastUpdated = new Date();
        }

        retr = encodeConsentString({
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
          vendorListVersion: this.vendorListVersion
        });

        cachedString = retr;
      }
      return retr;
    }
  }, {
    key: 'getLastUpdated',
    value: function getLastUpdated() {
      return this.lastUpdated;
    }
  }, {
    key: 'setLastUpdated',
    value: function setLastUpdated() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      cachedString = '';
      if (date) {
        this.lastUpdated = new Date(date);
      } else {
        this.lastUpdated = new Date();
      }
    }
  }, {
    key: 'getCreated',
    value: function getCreated() {
      return this.created;
    }
  }, {
    key: 'setCreated',
    value: function setCreated() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      cachedString = '';
      if (date) {
        this.created = new Date(date);
      } else {
        this.created = new Date();
      }
    }
  }, {
    key: 'getMaxVendorId',
    value: function getMaxVendorId() {
      if (!this.maxVendorId) {
        if (this.vendorList) {
          this.maxVendorId = _getMaxVendorId(this.vendorList.vendors);
        }
      }
      return this.maxVendorId;
    }
  }, {
    key: 'getParsedVendorConsents',
    value: function getParsedVendorConsents() {
      return encodeVendorIdsToBits(_getMaxVendorId(this.vendorList.vendors), this.allowedVendorIds);
    }
  }, {
    key: 'getParsedPurposeConsents',
    value: function getParsedPurposeConsents() {
      return encodePurposeIdsToBits(this.vendorList.purposes, this.allowedPurposeIds);
    }
  }, {
    key: 'getMetadataString',
    value: function getMetadataString() {
      return encodeConsentString({
        version: this.getVersion(),
        created: this.created,
        lastUpdated: this.lastUpdated,
        cmpId: this.cmpId,
        cmpVersion: this.cmpVersion,
        consentScreen: this.consentScreen,
        vendorListVersion: this.vendorListVersion
      });
    }
  }, {
    key: 'getVersion',
    value: function getVersion() {
      return this.version;
    }
  }, {
    key: 'getVendorListVersion',
    value: function getVendorListVersion() {
      return this.vendorListVersion;
    }
  }, {
    key: 'setGlobalVendorList',
    value: function setGlobalVendorList(vendorList) {
      if ((typeof vendorList === 'undefined' ? 'undefined' : _typeof(vendorList)) !== 'object') {
        throw new Error('ConsentString - You must provide an object when setting the global vendor list');
      }

      if (!vendorList.vendorListVersion || !Array.isArray(vendorList.purposes) || !Array.isArray(vendorList.vendors)) {
        // The provided vendor list does not look valid
        throw new Error('ConsentString - The provided vendor list does not respect the schema from the IAB EU’s GDPR Consent and Transparency Framework');
      }

      // does a vendorList already exist and is it a different version
      if (!this.vendorList || this.vendorListVersion !== vendorList.vendorListVersion) {
        cachedString = '';
        // Cloning the GVL
        // It's important as we might transform it and don't want to modify objects that we do not own
        this.vendorList = {
          vendorListVersion: vendorList.vendorListVersion,
          lastUpdated: vendorList.lastUpdated,
          purposes: vendorList.purposes,
          features: vendorList.features,

          // Clone the list and sort the vendors by ID (it breaks our range generation algorithm if they are not sorted)
          vendors: vendorList.vendors.slice(0).sort(function (firstVendor, secondVendor) {
            return firstVendor.id < secondVendor.id ? -1 : 1;
          })
        };
        this.vendorListVersion = vendorList.vendorListVersion;
      }
    }
  }, {
    key: 'getGlobalVendorList',
    value: function getGlobalVendorList() {
      return this.vendorList;
    }
  }, {
    key: 'setCmpId',
    value: function setCmpId(id) {
      if (id !== this.cmpId) {
        cachedString = '';
        this.cmpId = id;
      }
    }
  }, {
    key: 'getCmpId',
    value: function getCmpId() {
      return this.cmpId;
    }
  }, {
    key: 'setCmpVersion',
    value: function setCmpVersion(version) {
      if (version !== this.cmpVersion) {
        cachedString = '';
        this.cmpVersion = version;
      }
    }
  }, {
    key: 'getCmpVersion',
    value: function getCmpVersion() {
      return this.cmpVersion;
    }
  }, {
    key: 'setConsentScreen',
    value: function setConsentScreen(screenId) {
      if (screenId !== this.consentScreen) {
        cachedString = '';
        this.consentScreen = screenId;
      }
    }
  }, {
    key: 'getConsentScreen',
    value: function getConsentScreen() {
      return this.consentScreen;
    }
  }, {
    key: 'setConsentLanguage',
    value: function setConsentLanguage(language) {
      if (consentLanguageRegexp.test(language) === false) {
        throw new Error('ConsentString - The consent language must be a two-letter ISO639-1 code (en, fr, de, etc.)');
      }

      if (language !== this.consentLanguage) {
        cachedString = '';
        this.consentLanguage = language;
      }
    }
  }, {
    key: 'getConsentLanguage',
    value: function getConsentLanguage() {
      return this.consentLanguage;
    }
  }, {
    key: 'setPurposesAllowed',
    value: function setPurposesAllowed(purposeIds) {
      cachedString = '';
      this.allowedPurposeIds = purposeIds;
    }
  }, {
    key: 'getPurposesAllowed',
    value: function getPurposesAllowed() {
      return this.allowedPurposeIds;
    }
  }, {
    key: 'setPurposeAllowed',
    value: function setPurposeAllowed(purposeId, value) {
      var purposeIndex = this.allowedPurposeIds.indexOf(purposeId);

      cachedString = '';

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
  }, {
    key: 'isPurposeAllowed',
    value: function isPurposeAllowed(purposeId) {
      return this.allowedPurposeIds.indexOf(purposeId) !== -1;
    }
  }, {
    key: 'setVendorsAllowed',
    value: function setVendorsAllowed(vendorIds) {
      cachedString = '';
      this.allowedVendorIds = vendorIds;
    }
  }, {
    key: 'getVendorsAllowed',
    value: function getVendorsAllowed() {
      return this.allowedVendorIds;
    }
  }, {
    key: 'setVendorAllowed',
    value: function setVendorAllowed(vendorId, value) {
      var vendorIndex = this.allowedVendorIds.indexOf(vendorId);

      cachedString = '';
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
  }, {
    key: 'isVendorAllowed',
    value: function isVendorAllowed(vendorId) {
      return this.allowedVendorIds.indexOf(vendorId) !== -1;
    }
  }], [{
    key: 'decodeMetadataString',
    value: function decodeMetadataString(encodedMetadata) {
      var decodedString = decodeConsentString(encodedMetadata);
      var metadata = {};
      vendorVersionMap[decodedString.version].metadataFields.forEach(function (field) {
        metadata[field] = decodedString[field];
      });
      return metadata;
    }
  }]);

  return ConsentString;
}();

module.exports = {
  ConsentString: ConsentString
};