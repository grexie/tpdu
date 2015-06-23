
var constants = require('./constants');

var Parser = function() {

};

var parse = {
    address: function(buffer, sca) {
        var length = buffer.readUInt8(0);
        var type = buffer.readUInt8(1);
        var numberingPlan = type & 0xf;
        var addressType = (type >>> 4) & 0x7;
        var digits = '';
        if(sca) {
            for (var i = 1; i < length; i++) {
                var n = buffer.readUInt8(i + 1);
                var ln = n & 0xf;
                var hn = n >>> 4;
                if(hn === 0xf) {
                    digits += ln;
                } else {
                    digits += '' + ln + hn;
                }
            }
        } else {
            for (var i = 0; i < length; i += 2) {
                var n = buffer.readUInt8((i / 2) + 2);
                var ln = n & 0xf;
                var hn = n >>> 4;
                if(hn === 0xf) {
                    digits += ln;
                } else {
                    digits += '' + ln + hn;
                }
            }
        }
        return {
            addressType: addressType,
            numberingPlan: numberingPlan,
            address: digits
        };
    },

    read7bit: function(buffer, length) {
        var out = '', carry = 0;

        for(var i = 0; i < buffer.length; i++) {
            carry |= buffer.readUInt8(i) << (i % 7);

            out += constants.ALPHABET_7BIT.charAt(carry & 0x7f);
            carry >>>= 7;

            if(i % 7 === 6) {
                out += constants.ALPHABET_7BIT.charAt(carry & 0x7f);
                carry >>>= 7;
            }
        }

        return out;
    },

    readTimestamp: function(buffer) {
        var year = buffer.readUInt8(0);
        var month = buffer.readUInt8(1);
        var day = buffer.readUInt8(2);
        var hour = buffer.readUInt8(3);
        var minute = buffer.readUInt8(4);
        var second = buffer.readUInt8(5);
        var timeZone = buffer.readUInt8(6);

        year = (year >>> 4) + ((year & 0x0f) * 10);
        if(year < 70) year = 2000 + year;
        else year = 1900 + year;

        month = (month >>> 4) + ((month & 0x0f) * 10);
        day = (day >>> 4) + ((day & 0x0f) * 10);
        hour = (hour >>> 4) + ((hour & 0x0f) * 10);
        minute = (minute >>> 4) + ((minute & 0x0f) * 10);
        second = (second >>> 4) + ((second & 0x0f) * 10);

        var date = new Date();
        date.setUTCFullYear(year, month - 1, day);
        date.setUTCHours(hour, minute, second, 0);
        return date;
    },

    SMS_DELIVER: function(tpdu) {
        var out = {};

        var offset = tpdu.readUInt8(0) + 1;
        if(offset > 1) {
            out.sca = parse.address(tpdu, true);
        } else {
            out.sca = null;
        }


        out.direction = 'inbound';

        var mti = tpdu.readUInt8(offset++);
        out.tpmti = mti & 0x3;
        out.tpmms = (mti >>> 2) & 0x1;
        out.tpsri = (mti >>> 5) & 0x1;
        out.tpudhi = (mti >>> 6) & 0x1;
        out.tprp = (mti >>> 7) & 0x1;

        out.tpoa = parse.address(tpdu.slice(offset));
        offset += Math.ceil(tpdu.readUInt8(offset) / 2) + 2;

        out.tppid = tpdu.readUInt8(offset++);
        out.tpdcs = tpdu.readUInt8(offset++);

        out.tpscts = parse.readTimestamp(tpdu.slice(offset));
        offset += 7;

        out.tpudl = tpdu.readUInt8(offset++);
        out.tpud = parse.read7bit(tpdu.slice(offset), out.tpudl);

        return out;
    },

    SMS_SUBMIT: function(tpdu) {
        var out = {};

        var offset = tpdu.readUInt8(0) + 1;
        if(offset > 1) {
            out.sca = parse.address(tpdu, true);
        } else {
            out.sca = null;
        }

        out.direction = 'outbound';

        var mti = tpdu.readUInt8(offset++);
        out.tpmti = mti & 0x3;
        out.tprd = (mti >>> 2) & 0x1;
        out.tpvpf = (mti >>> 3) & 0x3;
        out.tpsrr = (mti >>> 5) & 0x1;
        out.tpudhi = (mti >>> 6) & 0x1;
        out.tprp = (mti >>> 7) & 0x1;

        out.tpmr = tpdu.readUInt8(offset++);

        out.tpda = parse.address(tpdu.slice(offset));
        offset += Math.ceil(tpdu.readUInt8(offset) / 2) + 2;

        out.tppid = tpdu.readUInt8(offset++);
        out.tpdcs = tpdu.readUInt8(offset++);
        out.tpvp = tpdu.readUInt8(offset++);

        out.tpudl = tpdu.readUInt8(offset++);
        out.tpud = parse.read7bit(tpdu.slice(offset), out.tpudl);

        return out;
    }
};

/**
 * Parses a T-PDU for the given direction.
 *
 * @param tpdu
 * @param direction
 * @returns {Object}
 */
Parser.prototype.parse = function(tpdu, direction) {
    tpdu = new Buffer(tpdu, 'hex');
    var tpmti = tpdu.readUInt8(1 + tpdu.readUInt8(0)) & 0x03;

    switch(direction) {
        case 'inbound':
            switch(tpmti) {
                case constants.SMS_DELIVER:
                    return parse.SMS_DELIVER(tpdu);
                default:
                    throw new Error("Unsupported TP-MTI: 0x" + tpmti.toString(16));
            }
            break;
        case 'outbound':
            switch(tpmti) {
                case constants.SMS_SUBMIT:
                    return parse.SMS_SUBMIT(tpdu);
                default:
                    throw new Error("Unsupported TP-MTI: 0x" + tpmti.toString(16));
            }
            break;
    }
};

module.exports = Parser;