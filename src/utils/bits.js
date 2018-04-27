/* eslint no-use-before-define: off */

const base64 = require('base-64');
const {
  versionNumBits,
  vendorVersionMap,
} = require('./definitions');

function repeat(count, string = '0') {
  let padString = '';

  for (let i = 0; i < count; i += 1) {
    padString += string;
  }

  return padString;
}

function padLeft(string, padding) {
  return repeat(Math.max(0, padding)) + string;
}

function padRight(string, padding) {
  return string + repeat(Math.max(0, padding));
}

function encodeIntToBits(number, numBits) {
  let bitString = '';

  if (typeof number === 'number' && !isNaN(number)) {
    bitString = parseInt(number, 10).toString(2);
  }

  // Pad the string if not filling all bits
  if (numBits >= bitString.length) {
    bitString = padLeft(bitString, numBits - bitString.length);
  }

  // Truncate the string if longer than the number of bits
  if (bitString.length > numBits) {
    bitString = bitString.substring(0, numBits);
  }

  return bitString;
}

function encodeBoolToBits(value) {
  return encodeIntToBits(value === true ? 1 : 0, 1);
}

function encodeDateToBits(date, numBits) {
  if (date instanceof Date) {
    return encodeIntToBits(date.getTime() / 100, numBits);
  }
  return encodeIntToBits(date, numBits);
}

function encodeLetterToBits(letter, numBits) {
  return encodeIntToBits(letter.toUpperCase().charCodeAt(0) - 65, numBits);
}

function encodeLanguageToBits(language, numBits = 12) {
  return encodeLetterToBits(language.slice(0, 1), numBits / 2)
    + encodeLetterToBits(language.slice(1), numBits / 2);
}

function decodeBitsToInt(bitString, start, length) {
  return parseInt(bitString.substr(start, length), 2);
}

function decodeBitsToDate(bitString, start, length) {
  return new Date(decodeBitsToInt(bitString, start, length) * 100);
}

function decodeBitsToBool(bitString, start) {
  return parseInt(bitString.substr(start, 1), 2) === 1;
}

function decodeBitsToLetter(bitString) {
  const letterCode = decodeBitsToInt(bitString);
  return String.fromCharCode(letterCode + 65).toLowerCase();
}

function decodeBitsToLanguage(bitString, start, length) {
  const languageBitString = bitString.substr(start, length);

  return decodeBitsToLetter(languageBitString.slice(0, length / 2))
    + decodeBitsToLetter(languageBitString.slice(length / 2));
}

function encodeField({ input, field }) {
  const { name, type, numBits, encoder, validator } = field;

  if (typeof validator === 'function') {
    if (!validator(input)) {
      return '';
    }
  }
  if (typeof encoder === 'function') {
    return encoder(input);
  }

  const bitCount = typeof numBits === 'function' ? numBits(input) : numBits;

  const inputValue = input[name];
  const fieldValue = inputValue === null || inputValue === undefined ? '' : inputValue;

  switch (type) {
    case 'int':
      return encodeIntToBits(fieldValue, bitCount);
    case 'bool':
      return encodeBoolToBits(fieldValue);
    case 'date':
      return encodeDateToBits(fieldValue, bitCount);
    case 'bits':
      return padRight(fieldValue, bitCount - fieldValue.length).substring(0, bitCount);
    case 'list':
      return fieldValue.reduce((acc, listValue) => acc + encodeFields({
        input: listValue,
        fields: field.fields,
      }), '');
    case 'language':
      return encodeLanguageToBits(fieldValue, bitCount);
    default:
      throw new Error(`ConsentString - Unknown field type ${type} for encoding`);
  }
}

function encodeFields({ input, fields }) {
  return fields.reduce((acc, field) => {
    acc += encodeField({ input, field });

    return acc;
  }, '');
}

function decodeField({ input, output, startPosition, field }) {
  const { type, numBits, decoder, validator, listCount } = field;

  if (typeof validator === 'function') {
    if (!validator(output)) {
      // Not decoding this field so make sure we start parsing the next field at
      // the same point
      return { newPosition: startPosition };
    }
  }

  if (typeof decoder === 'function') {
    return decoder(input, output, startPosition);
  }

  const bitCount = typeof numBits === 'function' ? numBits(output) : numBits;

  let listEntryCount = 0;
  if (typeof listCount === 'function') {
    listEntryCount = listCount(output);
  } else if (typeof listCount === 'number') {
    listEntryCount = listCount;
  }

  switch (type) {
    case 'int':
      return { fieldValue: decodeBitsToInt(input, startPosition, bitCount) };
    case 'bool':
      return { fieldValue: decodeBitsToBool(input, startPosition) };
    case 'date':
      return { fieldValue: decodeBitsToDate(input, startPosition, bitCount) };
    case 'bits':
      return { fieldValue: input.substr(startPosition, bitCount) };
    case 'list':
      return new Array(listEntryCount).fill().reduce((acc) => {
        const { decodedObject, newPosition } = decodeFields({
          input,
          fields: field.fields,
          startPosition: acc.newPosition,
        });
        return {
          fieldValue: [...acc.fieldValue, decodedObject],
          newPosition,
        };
      }, { fieldValue: [], newPosition: startPosition });
    case 'language':
      return { fieldValue: decodeBitsToLanguage(input, startPosition, bitCount) };
    default:
      throw new Error(`ConsentString - Unknown field type ${type} for decoding`);
  }
}

function decodeFields({ input, fields, startPosition = 0 }) {
  let position = startPosition;

  const decodedObject = fields.reduce((acc, field) => {
    const { name, numBits } = field;
    const { fieldValue, newPosition } = decodeField({
      input,
      output: acc,
      startPosition: position,
      field,
    });

    if (fieldValue !== undefined) {
      acc[name] = fieldValue;
    }

    if (newPosition !== undefined) {
      position = newPosition;
    } else if (typeof numBits === 'number') {
      position += numBits;
    }

    return acc;
  }, {});

  return {
    decodedObject,
    newPosition: position,
  };
}

/**
 * Encode the data properties to a bit string. Encoding will encode
 * either `selectedVendorIds` or the `vendorRangeList` depending on
 * the value of the `isRange` flag.
 */
function encodeDataToBits(data, definitionMap) {
  const { version } = data;

  if (typeof version !== 'number') {
    throw new Error('ConsentString - No version field to encode');
  } else if (!definitionMap[version]) {
    throw new Error(`ConsentString - No definition for version ${version}`);
  } else {
    const fields = definitionMap[version].fields;
    return encodeFields({ input: data, fields });
  }
}

/**
 * Take all fields required to encode the consent string and produce the URL safe Base64 encoded value
 */
function encodeToBase64(data, definitionMap = vendorVersionMap) {
  const binaryValue = encodeDataToBits(data, definitionMap);

  if (binaryValue) {
    // Pad length to multiple of 8
    const paddedBinaryValue = padRight(binaryValue, 7 - ((binaryValue.length + 7) % 8));

    // Encode to bytes
    let bytes = '';
    for (let i = 0; i < paddedBinaryValue.length; i += 8) {
      bytes += String.fromCharCode(parseInt(paddedBinaryValue.substr(i, 8), 2));
    }

    // Make base64 string URL friendly
    return base64.encode(bytes)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  return null;
}

function decodeConsentStringBitValue(bitString, definitionMap = vendorVersionMap) {
  const version = decodeBitsToInt(bitString, 0, versionNumBits);

  if (typeof version !== 'number') {
    throw new Error('ConsentString - Unknown version number in the string to decode');
  } else if (!vendorVersionMap[version]) {
    throw new Error(`ConsentString - Unsupported version ${version} in the string to decode`);
  }

  const fields = definitionMap[version].fields;
  const { decodedObject } = decodeFields({ input: bitString, fields });

  return decodedObject;
}

/**
 * Decode the (URL safe Base64) value of a consent string into an object.
 */
function decodeFromBase64(consentString, definitionMap) {
  // Add padding
  let unsafe = consentString;
  while (unsafe.length % 4 !== 0) {
    unsafe += '=';
  }

  // Replace safe characters
  unsafe = unsafe
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const bytes = base64.decode(unsafe);

  let inputBits = '';
  for (let i = 0; i < bytes.length; i += 1) {
    const bitString = bytes.charCodeAt(i).toString(2);
    inputBits += padLeft(bitString, 8 - bitString.length);
  }

  return decodeConsentStringBitValue(inputBits, definitionMap);
}

function decodeBitsToIds(bitString) {
  return bitString.split('').reduce((acc, bit, index) => {
    if (bit === '1') {
      if (acc.indexOf(index + 1) === -1) {
        acc.push(index + 1);
      }
    }
    return acc;
  }, []);
}

module.exports = {
  padRight,
  padLeft,
  encodeField,
  encodeDataToBits,
  encodeIntToBits,
  encodeBoolToBits,
  encodeDateToBits,
  encodeLanguageToBits,
  encodeLetterToBits,
  encodeToBase64,
  decodeBitsToIds,
  decodeBitsToInt,
  decodeBitsToDate,
  decodeBitsToBool,
  decodeBitsToLanguage,
  decodeBitsToLetter,
  decodeFromBase64,
};
