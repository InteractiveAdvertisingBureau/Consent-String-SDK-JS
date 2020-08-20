# Transparency and Consent Framework v1.1: Consent String SDK (JavaScript)

[![Build Status](https://travis-ci.org/didomi/consent-string.svg?branch=master)](https://travis-ci.org/didomi/consent-string)
[![Coverage Status](https://coveralls.io/repos/github/didomi/consent-string/badge.svg?branch=master)](https://coveralls.io/github/didomi/consent-string?branch=master)

Encode and decode web-safe base64 consent information with the IAB EU's GDPR Transparency and Consent Framework.

This library is a JavaScript reference implementation for dealing with consent strings in the IAB EU's GDPR Transparency and Consent Framework.  
It should be used by anyone who receives or sends consent information like vendors that receive consent data from a partner, or consent management platforms that need to encode/decode the global cookie.

The IAB specification for the consent string format is available on the [IAB Github](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Consent%20string%20and%20vendor%20list%20formats%20v1.1%20Final.md) (section "Vendor Consent Cookie Format").

**This library fully supports the version v1.1 of the specification. It can encode and decode consent strings with version bit 1.**

#### IAB Europe Transparency and Consent Framework 

In November 2017, IAB Europe and a cross-section of the publishing and advertising industry, announced a new Transparency & Consent Framework to help publishers, advertisers and technology companies comply with key elements of GDPR. The Framework will give the publishing and advertising industries a common language with which to communicate consumer consent for the delivery of relevant online advertising and content. 

Framework Technical specifications available at: https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework.

---

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
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

## Documentation

#### Consent String
[Methods](consent_string_methods.md)

[Use Cases](consent_string_use_cases.md)

## About 

#### About IAB Tech Lab  

The IAB Technology Laboratory (?Tech Lab?) is a non-profit research and development consortium that produces and provides standards, software, and services to drive growth of an effective and sustainable global digital media ecosystem. Comprised of digital publishers and ad technology firms, as well as marketers, agencies, and other companies with interests in the interactive marketing arena, IAB Tech Lab aims to enable brand and media growth via a transparent, safe, effective supply chain, simpler and more consistent measurement, and better advertising experiences for consumers, with a focus on mobile and ?TV?/digital video channel enablement. The IAB Tech Lab portfolio includes the DigiTrust real-time standardized identity service designed to improve the digital experience for consumers, publishers, advertisers, and third-party platforms. Board members include AppNexus, ExtremeReach, Google, GroupM, Hearst Digital Media, Integral Ad Science, Index Exchange, LinkedIn, MediaMath, Microsoft, Moat, Pandora, PubMatic, Quantcast, Telaria, The Trade Desk, and Yahoo! Japan. Established in 2014, the IAB Tech Lab is headquartered in New York City with an office in San Francisco and representation in Seattle and London.

Learn more about IAB Tech Lab here: [https://www.iabtechlab.com/](https://www.iabtechlab.com/)

#### About IAB Europe 

IAB Europe is the voice of digital business and the leading European-level industry association for the interactive advertising ecosystem. Its mission is to promote the development of this innovative sector by shaping the regulatory environment, investing in research and education, and developing and facilitating the uptake of business standards.
 
Learn more about IAB Europe here: [https://www.iabeurope.eu/](https://www.iabeurope.eu/)


#### Contributors and Technical Governance

GDPR Technical Working Group members provide contributions to this repository. Participants in the GDPR Technical Working group must be members of IAB Tech Lab. Technical Governance for the project is provided by the IAB Tech Lab GDPR Commit Group. 
