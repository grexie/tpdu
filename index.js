
var Parser = require('./lib/parser');
var Builder = require('./lib/builder');
var constants = require('./lib/constants');

module.exports = {
    Parser: Parser,
    Builder: Builder,

    parse: function(tpdu, direction) {
        var parser = new Parser();
        return parser.parse(tpdu, direction);
    },

    stringify: function(tpdu) {
        var builder = new Builder(tpdu);
        return builder.build();
    }
};

for(var v in constants) {
    module.exports[v] = constants[v];
}