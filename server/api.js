'use strict';

const socketio      = require('socket.io');
const Container     = require('./container/container.js');
const fs            = require('fs');

module.exports = function attach(server) {
    const io = socketio(server);
    let container;
    try {
        let data = JSON.parse(fs.readFileSync(__dirname + '/data/state.json'));
        container = Container(data.state, data.hash);
    } catch (e) {
        container = Container({ todos: [] }, 0);
    }

    function save() {
        fs.writeFile(__dirname + '/data/state.json', JSON.stringify({ state: container.getState(), hash: container.getHash() }), ()=>{});
    }

    setInterval(save, 1000);

    io.on('connection', (socket) => {
        console.log("Client connected");

        socket.on('state', function() {
            socket.emit('state', container.getState(), container.getHash());
        });

        socket.on('action', (action, hash) => {
            try {
                io.emit('state', container.apply(action, hash), container.getHash());
            } catch (err) {
                socket.emit('response', err);
            }
        });

    });
}
