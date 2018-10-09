# Transparency and Consent Framework: Consent String SDK (JavaScript)

[![Build Status](https://travis-ci.org/didomi/consent-string.svg?branch=master)](https://travis-ci.org/didomi/consent-string)
[![Coverage Status](https://coveralls.io/repos/github/didomi/consent-string/badge.svg?branch=master)](https://coveralls.io/github/didomi/consent-string?branch=master)

Encode and decode web-safe base64 consent information with the IAB EU's GDPR Transparency and Consent Framework.

This library is a JavaScript reference implementation for dealing with consent strings in the IAB EU's GDPR Transparency and Consent Framework.  
It should be used by anyone who receives or sends consent information like vendors that receive consent data from a partner, or consent management platforms that need to encode/decode the global cookie.

The IAB specification for the consent string format is available on the [IAB Github](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Consent%20string%20and%20vendor%20list%20formats%20v1.1%20Final.md) (section "Vendor Consent Cookie Format").

**This library fully supports the version v1.1 of the specification. It can encode and decode consent strings with version bit 1.**

#### IAB Europe Transparency and Consent Framework 

In November 2017, IAB Europe and a cross-section of the publishing and advertising industry, announced a new Transparency & Consent Framework to help publishers, advertisers and technology companies comply with key elements of GDPR. The Framework will give the publishing and advertising industries a common language with which to communicate consumer consent for the delivery of relevant online advertising and content. 

Framework Technical specifications available at: https://raw.githubusercontent.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework. 

---

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [Use cases](#use-cases)
- [Documentation](#documentation)

## Terms

| Term  | Meaning  |
| --- | --- |
| IAB  | Interactive Advertising Bureau  |
| TCF  | Transparency and Consent Framework  |
| Vendor ID  | Refers to IAB EU hosted Global Vendor List id defined by the TCF  |
| Consent String  | Refers to IAB EU Base64 encoded bit string representing user preference in the TCF  |
| CMP  | "Consent Management Provider" as specified by the TCF -- ie. a javascript widget that captures users consent preferences and displays advertising information and vendors.  |
| Consent Screen  | CMP Screen in which consent was confirmed.  A proprietary number to each CMP that is arbitrary.  |

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
// It can be found here - https://vendorlist.consensu.org/vendorlist.json
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

#### constructor
Constructs new object

```javascript
// @param str is the web-safe base64 encoded consent string or null (no parameter) 
constructor( str = null )
```
---

#### getConsentString()
Gets the consent string either new one created or one passed in on construction.
```javascript
// @return web-safe base64 encoded consent string
getConsentString()
```


---
#### getMaxVendorId()
Gets the maxVendorId from the vendor list. 
```javascript
// @return number 
getMaxVendorId()
```
---
#### getParsedVendorConsents()
Gets the binary string format of the vendor consents.  1 being has consent 0 being no consent.
```javascript
// @return string (binary) 
getParsedVendorConsents()
```
---
#### getParsedPurposes()
Gets the binary string format of the purpose consents.  1 being has consent 0 being no consent.
```javascript
// @return string (binary) 
getParsedPurposes()
```
---
#### getMetadataString()
Gets the metadata string as defined in the response to the getVendorConsents method (ie binary string that includes only header information like consent string version, timestamps, cmp ID, etc. but no purposes/consents information).

```javascript
// @return web-safe base64 encoded metadata string 
getMetadataString()
```
---

#### ConsentString.decodeMetadataString() (Static Method)
Decodes the metadata string.

```javascript
// @return object with metadata fields 
ConsentString.decodeMetadataString(encodedMetadataString)
```
---
#### getVersion()
The version number in which this consent string specification adheres to

```javascript
// @return integer version number of consent string specification 
getVersion()
```

---
#### getVendorListVersion()
Returns either the vendor list version set by `setGlobalVendorList` or whatever was previously set as the consent string when the object was created

```javascript
// @return integer version number of vendor list version 
getVendorListVersion()
```
---
#### setGlobalVendorList( gvlObject )
Sets the global vendor list object.  Generally this would be the parsed JSON that comes from the IAB hosted Global Vendor List.

```javascript
// @param gvlObject is the parsed JSON that conforms to the IAB EU TCF Vendor List Specification
setGlobalVendorList( gvlObject )
```
---
#### setCmpId( cmpId )
Sets CMP ID number that is assigned to your CMP from the IAB EU.  A unique ID will be assigned to each Consent Manager Provider

```javascript
// @param cmpId the id for the cmp setting the consent string values.
setCmpId( cmpId )
```
---
#### getCmpId()
Get the ID of the CMP from the consent string

```javascript
// @return CMP id
getCmpId()
```
---
#### setCmpVersion( version )
Sets the version of the CMP code that created or updated the consent string

```javascript
// @param version - CMP version
setCmpVersion( version )
```
---
#### getCmpVersion()
The version of the CMP code that created or updated the consent string

```javascript
// @return version CMP version
getCmpVersion()
```
---
#### setConsentScreen( screenId )
Sets the consent screen id.  The screen number is CMP and CMP Version specific, and is for logging proof of consent

```javascript
// @param screenId id for the screen in which the consent values were confirmed
setConsentScreen( screenId )
```
---
#### getConsentScreen()
The screen number is CMP and CmpVersion specific, and is for logging proof of consent

```javascript
// @return screenId id for the screen in which the consent values were confirmed
getConsentScreen()
```
---
#### setConsentLanguage( language ) 
Sets consent language. Two-letter ISO639-1 language code that CMP asked for consent in

```javascript
// @param language two character ISO639-1 language code
setConsentLanguage( language )
```
---
#### getConsentLanguage()
gets consent language. Two-letter ISO639-1 language code that CMP asked for consent in

```javascript
// @return language two character ISO639-1 language code
getConsentLanguage()
```
---
#### setPurposesAllowed( purposeIdArray)
Sets the allowed purposes as an array of purpose ids

```javascript
// @param purposeIdArray variable length array of integers setting which purposes are allowed.  If the id is in the array it’s allowed.
setPurposesAllowed( purposeIdArray)
```
---
#### getPurposesAllowed()
Gets an array of purposes allowed either set by `setPurposesAllowed` or whatever was previously set by the initializing consent string

```javascript
// @return variable length array of integers setting which purposes are allowed.  If the id is in the array it’s allowed.
getPurposesAllowed()
```
---
#### setPurposeAllowed( purposeId, value )
Sets a single purpose by id and boolean value

```javascript
// @param purposeId the purpose id
// @param value the boolean value to set it to true for allowed false for not allowed
setPurposeAllowed( purposeId, value )
```
---
#### isPurposeAllowed( purposeId ) 
Gets a single purpose by id and returns boolean value

```javascript
// @param purposeId the purpose id
// @return boolean value true for allowed false for not allowed
isPurposeAllowed( purposeId )
```
---
#### setVendorAllowed( vendorId, valueBool ) 
Sets consent value for a vendor id

```javascript
// @param vendorId - vendor id to set consent value for
// @param value - the boolean value to set the consent to 
setVendorAllowed( vendorId, valueBool )
```
---
#### isVendorAllowed( vendorId ) 
For determining if the vendor consent value bit is turned on or off for a particular vendor id.

```javascript
// @param vendorId vendor id to see if consent is allowed for
// @return boolean value of consent for that vendor id

isVendorAllowed( vendorId )
```
## About 

#### About IAB Tech Lab  

The IAB Technology Laboratory (?Tech Lab?) is a non-profit research and development consortium that produces and provides standards, software, and services to drive growth of an effective and sustainable global digital media ecosystem. Comprised of digital publishers and ad technology firms, as well as marketers, agencies, and other companies with interests in the interactive marketing arena, IAB Tech Lab aims to enable brand and media growth via a transparent, safe, effective supply chain, simpler and more consistent measurement, and better advertising experiences for consumers, with a focus on mobile and ?TV?/digital video channel enablement. The IAB Tech Lab portfolio includes the DigiTrust real-time standardized identity service designed to improve the digital experience for consumers, publishers, advertisers, and third-party platforms. Board members include AppNexus, ExtremeReach, Google, GroupM, Hearst Digital Media, Integral Ad Science, Index Exchange, LinkedIn, MediaMath, Microsoft, Moat, Pandora, PubMatic, Quantcast, Telaria, The Trade Desk, and Yahoo! Japan. Established in 2014, the IAB Tech Lab is headquartered in New York City with an office in San Francisco and representation in Seattle and London.

Learn more about IAB Tech Lab here: [https://www.iabtechlab.com/](https://www.iabtechlab.com/)

#### About IAB Europe 

IAB Europe is the voice of digital business and the leading European-level industry association for the interactive advertising ecosystem. Its mission is to promote the development of this innovative sector by shaping the regulatory environment, investing in research and education, and developing and facilitating the uptake of business standards.
 
Learn more about IAB Europe here: [https://www.iabeurope.eu/](https://www.iabeurope.eu/)


#### Contributors and Technical Governance

GDPR Technical Working Group members provide contributions to this repository. Participants in the GDPR Technical Working group must be members of IAB Tech Lab. Technical Governance for the project is provided by the IAB Tech Lab GDPR Commit Group. 
