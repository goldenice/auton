'use strict';

const hash   = require('object-hash');

const hashOptions = {
    algorithm: 'sha1',
    encoding: 'hex',
    respectFunctionProperties: false,
    respectFunctionNames: false,
    respectType: false,
    unorderedArrays: false,
    unorderedSets: true,
};

module.exports = function(obj) {
    return hash(obj, hashOptions);
};
