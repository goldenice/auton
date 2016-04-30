'use strict';

const socketio      = require('socket.io');
const fs            = require('fs');
const redux         = require('redux');
const reducer       = require('./reducer.js');
const nodeUuid      = require('node-uuid');

const SAVEFILE = __dirname + '/data/state.json'

module.exports = function attach(server) {
    const io = socketio(server);
    let uuid = null;

    // Set up redux store
    let store;
    (function() {
        let initialState;
        try {
            let save = JSON.parse(fs.readFileSync(SAVEFILE));
            uuid = save.uuid;
            initialState = save.state;
        } catch (e) {
            initialState = require('./initialState.js');
        }
        store = redux.createStore(reducer, initialState);
    })();

    // Generate and push out new state on update
    store.subscribe(() => {
        uuid = nodeUuid.v4();
        io.emit('state', store.getState(), uuid);
    });

    // Save app state on change
    store.subscribe(() => {
        fs.writeFile(SAVEFILE, JSON.stringify({ state: store.getState(), uuid: uuid }));
    });

    // When client connects
    io.on('connection', (socket) => {
        socket.on('state', function() {
            socket.emit('state', store.getState(), uuid);
        });

        socket.on('action', (action, clientUuid) => {
            if (uuid != clientUuid) return socket.emit('response', { err: 'invalid-update', state: store.getState() });
            store.dispatch(action);
        });
    });
}
