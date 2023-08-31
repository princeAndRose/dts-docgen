const docGen = require('../src/index');

const input = './test/types';

const path = require('path');

docGen(undefined, {
  input,
  enableEscape: true
});
