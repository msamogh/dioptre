var _ = require('underscore');

class Base {
    _bind(...methods) {
        methods.forEach( (method) => this[method] = this[method].bind(this) );
    }
}

export default Base;