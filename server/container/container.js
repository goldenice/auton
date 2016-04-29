'use strict';

const hashAction    = require('./tools/hashaction.js');
const hashObject    = require('./tools/hashobject.js');
const reducer       = require('./reducer.js');

module.exports = function(initialState, initialHash) {
    let hash = initialHash !== undefined ? initialHash : hashObject(initialState);
    let state = initialState;

    return {
        getState: function getState() {
            return state;
        },
        getHash: function getHash() {
            return hash;
        },
        apply: function apply(action, clientLatestHash) {
            // Check if the next update is even valid
            if (clientLatestHash != hash) throw { error: 'invalid-update', state: state, hash: hash };

            // Update hash and state
            hash = hashAction(hash, action);
            state = reducer(state, action);
            console.log("Updating state: ", state);
            return state;
        }
    };
};
