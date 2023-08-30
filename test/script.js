const docGen = require('../src/index');

const input = './types/index.d.ts';

const path = require('path');

docGen(undefined, {
  input
});
