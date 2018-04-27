# Consent String SDK (JavaScript)

[![Build Status](https://travis-ci.org/didomi/consent-string.svg?branch=master)](https://travis-ci.org/didomi/consent-string)
[![Coverage Status](https://coveralls.io/repos/github/didomi/consent-string/badge.svg?branch=master)](https://coveralls.io/github/didomi/consent-string?branch=master)

Encode and decode web-safe base64 consent information with the IAB EU's GDPR Transparency and Consent Framework.

This library is a JavaScript reference implementation for dealing with consent strings in the IAB EU's GDPR Transparency and Consent Framework.  
It should be used by anyone who receives or sends consent information like vendors that receive consent data from a partner, or consent management platforms that need to encode/decode the global cookie.

The IAB specification for the consent string format is available on the [IAB Github](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Consent%20string%20and%20vendor%20list%20formats%20v1.1%20Final.md) (section "Vendor Consent Cookie Format").

**This library fully supports the version v1.1 of the specification. It can encode and decode consent strings with version bit 1.**

---

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [Use cases](#use-cases)
- [Documentation](#documentation)

## Installation

### For a browser application

The `consent-string` library is designed to be as lightweight as possible and has no external dependency when used in a client-side application.

You can install it as a standard `npm` library:

```bash
npm install --save consent-string
```

**Note:** You will need webpack or a similar module bundler to correctly pack the library for use in a browser.

### For Node.js

You can install it as a standard `npm` library:

```bash
npm install --save consent-string
```

## Usage

### Decode a consent string

You can decode a base64-encoded consent string by passing it as a parameter to the `ConsentString` constructor:

```javascript
const { ConsentString } = require('consent-string');

const consentData = new ConsentString('BOQ7WlgOQ7WlgABABwAAABJOACgACAAQABA');

// `consentData` contains the decoded consent information
```

**Note:** You do not need the IAB global vendor list for decoding a consent string as long as you know the purpose and vendor IDs you are looking for.

### Encode consent data

```javascript
const { ConsentString } = require('consent-string');

const consentData = new ConsentString();

// Set the global vendor list
// You need to download and provide the vendor list yourself
consentData.setGlobalVendorList(vendorList);

// Set the consent data
consentData.setCmpId(1);
consentData.setCmpVersion(1);
consentData.setConsentScreen(1);
consentData.setConsentLanguage('en');
consentData.setPurposesAllowed([1, 2, 4]);
consentData.setVendorsAllowed([1, 24, 245]);

// Encode the data into a web-safe base64 string
consentData.getConsentString();
```

## Use cases

### Vendors

Vendors that receive a consent string encoded by a Consent Management Platform, on a webpage or in a mobile application, can decode the string and determine if they the user has given consent to their specific purpose and vendor IDs.

**Example:**

Assuming you are the vendor with ID 1 and want to check that the user has given consent to access her device (purpose 1) and personalize advertizing (purpose 2):

```javascript
const { ConsentString } = require('consent-string');

const consentData = new ConsentString('encoded base64 consent string received');

if (
  consentData.isVendorAllowed(1)
  && consentData.isPurposeAllowed(1)
  && consentData.isPurposeAllowed(2)
) {
  // The vendor ID and the purposes are all allowed
  // Process with your data collection / processing
} else {
  // Either the vendor or one of the purposes is not allowed by the user
  // Do not collect or process personal data
}
```

### Consent management platforms

CMPs can read a cookie, modify its content then update the cookie value with the correct encoding.

```javascript
const { ConsentString } = require('consent-string');

// Decode the base64-encoded consent string contained in the cookie
const consentData = new ConsentString(readCookieValue());

// Modify the consent data
consentData.setCmpId(1);
consentData.setConsentScreen(1);
consentData.setPurposeAllowed(12, true);

// Update the cookie value
writeCookieValue(consentData.getConsentString());
```

**Note:** CMPs need to manage the cookie operations (reading and writing) themselves.

## Documentation

The documentation for the API exposed by this library is available here: https://didomi.github.io/consent-string/
