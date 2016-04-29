'use strict';

const _ = require('lodash');

module.exports = function(state, action) {
    let target = _.cloneDeep(state);
    if (action.type == 'add') {
        target.todos.push(action.todo);
    } else if (action.type == 'remove') {
        target.todos.splice(action.id, 1);
    }
    return target;
}
