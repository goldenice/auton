'use strict';

const sha1      = require('sha1');
const hash      = require('./hashobject.js');

module.exports = function(prevHash, action) {
    return sha1(prevHash + hash(action));
};
