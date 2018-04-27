module.exports = {
  "extends": "airbnb-base",
  "plugins": [
      "import"
  ],
  "env": {
    "node": true
  },
  "rules": {
    "no-console": "error",
    "no-prototype-builtins": "off",
    "max-len": ["error", 100, 2, {
      "ignoreUrls": true,
      "ignoreComments": true,
      "ignoreRegExpLiterals": true,
      "ignoreStrings": true,
      "ignoreTemplateLiterals": true,
    }],
    'no-param-reassign': 'off',
  }
};
