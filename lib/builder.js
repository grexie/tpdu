
var constants = require('./constants');
var builderTable = new WeakMap();


var Builder = function(tpdu) {
    builderTable.set(this, tpdu || {});
};

/**
 * Service Center Address
 *
 * @param addressType
 * @param numberingPlan
 * @param address
 * @returns {Builder}
 */
Builder.prototype.sca = function(addressType, numberingPlan, address) {
    var tpdu = builderTable.get(this);
    tpdu.sca = {
        addressType: addressType,
        numberingPlan: numberingPlan,
        address: address
    };
    return this;
};

/**
 * Direction
 *
 * @param direction
 * @returns {Builder}
 */
Builder.prototype.direction = function(direction) {
    var tpdu = builderTable.get(this);
    tpdu.direction = direction;
    return this;
};

/**
 * Message Type Indicator
 *
 * @param tpmti
 * @returns {Builder}
 */
Builder.prototype.tpmti = function(tpmti) {
    var tpdu = builderTable.get(this);
    tpdu.tpmti = tpmti;
    return this;
};

/**
 * More Messages to Send
 *
 * @param tpmms
 * @returns {Builder}
 */
Builder.prototype.tpmms = function(tpmms) {
    var tpdu = builderTable.get(this);
    tpdu.tpmms = tpmms;
    return this;
};

/**
 * Reject Duplicates
 *
 * @param tprd
 * @returns {Builder}
 */
Builder.prototype.tprd = function(tprd) {
    var tpdu = builderTable.get(this);
    tpdu.tprd = tprd;
    return this;
};

/**
 * Validity Period Format
 *
 * @param tpvpf
 * @returns {Builder}
 */
Builder.prototype.tpvpf = function(tpvpf) {
    var tpdu = builderTable.get(this);
    tpdu.tpvpf = tpvpf;
    return this;
}

/**
 * Status Report Request
 *
 * @param tpsrr
 * @returns {Builder}
 */
Builder.prototype.tpsrr = function(tpsrr) {
    var tpdu = builderTable.get(this);
    tpdu.tpsrr = tpsrr;
    return this;
};

/**
 * Status Report Indication
 *
 * @param tpsri
 * @returns {Builder}
 */
Builder.prototype.tpsri = function(tpsri) {
    var tpdu = builderTable.get(this);
    tpdu.tpsri = tpsri;
    return this;
};

/**
 * User Header Data Indicator
 *
 * @param uhdi
 * @returns {Builder}
 */
Builder.prototype.tpudhi = function(tpudhi) {
    var tpdu = builderTable.get(this);
    tpdu.tpudhi = tpudhi;
    return this;
};


/**
 * Reply Path
 *
 * @param tprp
 * @returns {Builder}
 */
Builder.prototype.tprp = function(tprp) {
    var tpdu = builderTable.get(this);
    tpdu.tprp = tprp;
    return this;
};

/**
 * Message Reference
 *
 * @param tpmr
 * @returns {Builder}
 */
Builder.prototype.tpmr = function(tpmr) {
    var tpdu = builderTable.get(this);
    tpdu.tpmr = tpmr;
    return this;
};

/**
 * Originating Address
 *
 * @param tpoa
 * @returns {Builder}
 */
Builder.prototype.tpoa = function(addressType, numberingPlan, address) {
    var tpdu = builderTable.get(this);
    tpdu.tpoa = {
        addressType: addressType,
        numberingPlan: numberingPlan,
        address: address
    };
    return this;
};

/**
 * Destination Address
 *
 * @param addressType
 * @param numberingPlan
 * @param address
 * @returns {Builder}
 */
Builder.prototype.tpda = function(addressType, numberingPlan, address) {
    var tpdu = builderTable.get(this);
    tpdu.tpda = {
        addressType: addressType,
        numberingPlan: numberingPlan,
        address: address
    };
    return this;
};

/**
 * Protocol Identifier
 *
 * @param tppid
 * @returns {Builder}
 */
Builder.prototype.tppid = function(tppid) {
    var tpdu = builderTable.get(this);
    tpdu.tppid = tppid;
    return this;
};

/**
 * Data Coding Scheme
 *
 * @param tpdcs
 * @returns {Builder}
 */
Builder.prototype.tpdcs = function(tpdcs) {
    var tpdu = builderTable.get(this);
    tpdu.tpdcs = tpdcs;
    return this;
};

/**
 * Validity Period
 *
 * @param tpvp
 * @returns {Builder}
 */
Builder.prototype.tpvp = function(tpvp) {
    var tpdu = builderTable.get(this);
    tpdu.tpvp = tpvp;
    return this;
};

/**
 * Service Center Time Stamp
 *
 * @param tpscts
 * @returns {Builder}
 */
Builder.prototype.tpscts = function(tpscts) {
    var tpdu = builderTable.get(this);
    tpdu.tpscts = tpscts;
    return this;
};

/**
 * User Data Length
 *
 * @param tpudl
 * @returns {Builder}
 */
Builder.prototype.tpudl = function(tpudl) {
    var tpdu = builderTable.get(this);
    tpdu.tpudl = tpudl;
    return this;
};

/**
 * User Data
 *
 * @param tpud
 * @returns {Builder}
 */
Builder.prototype.tpud = function(tpud) {
    var tpdu = builderTable.get(this);
    tpdu.tpud = tpud;
    return this;
};



var build = {
    address: function(address, sca) {
        if(sca) {
            if(!address || address.address.length === 0) {
                var buffer = new Buffer(1);
                buffer.writeUInt8(0, 0);
                return buffer;
            }
            var length = (1 + Math.ceil(address.address.length / 2)) | 0;
        } else {
            var length = Math.ceil(address.address.length) | 0;
        }
        var type = address.numberingPlan | (address.addressType << 4) | 0x80;
        var digits = [length, type];
        if(sca) {
            for (var i = 1; i < length; i++) {
                var ln = parseInt(address.address.charAt((i - 1) * 2), 16) & 0xf;
                var hn = parseInt(address.address.charAt((i - 1) * 2 + 1) || 'f', 16) & 0xf;
                digits.push(ln | hn << 4);
            }
        } else {
            for (var i = 0; i < length; i += 2) {
                var ln = parseInt(address.address.charAt(i), 16) & 0xf;
                var hn = parseInt(address.address.charAt(i + 1) || 'f', 16) & 0xf;
                digits.push(ln | hn << 4);
            }
        }
        return new Buffer(digits, 'raw');
    },

    write7bit: function(payload) {
        var buffer = new Buffer(Math.ceil((payload.length * 7) / 8)), c = 0;
        buffer.fill(0);

        for(var i = 0; i < payload.length; i++) {
            var char = constants.ALPHABET_7BIT.indexOf(payload.charAt(i)) & 0x7f;


            var ls = char << ((8 - (i % 8)) % 8);
            var hs = (ls & 0xff00) >>> 8;
            ls &= 0xff;


            var index = ((i * 7) / 8) | 0;
            buffer.writeUInt8(buffer.readUInt8(index) | ls, index);
            buffer.writeUInt8(buffer.readUInt8(index + 1) | hs, index + 1);
        }

        return buffer;
    },

    writeTimestamp: function(timestamp) {
        var year = parseInt(timestamp.getUTCFullYear().toString().substring(2), 10);
        var month = (timestamp.getUTCMonth() + 1);
        var day = (timestamp.getUTCDate());
        var hour = (timestamp.getUTCHours());
        var minute = (timestamp.getUTCMinutes());
        var second = (timestamp.getUTCSeconds());

        var buffer = new Buffer(7);
        buffer.writeUInt8(((year % 10) << 4) | (year / 10), 0);
        buffer.writeUInt8(((month % 10) << 4) | (month / 10), 1);
        buffer.writeUInt8(((day % 10) << 4) | (day / 10), 2);
        buffer.writeUInt8(((hour % 10) << 4) | (hour / 10), 3);
        buffer.writeUInt8(((minute % 10) << 4) | (minute / 10), 4);
        buffer.writeUInt8(((second % 10) << 4) | (second / 10), 5);
        buffer.writeUInt8(0, 6);
        return buffer;
    },

    SMS_DELIVER: function(tpdu) {
        var sca = build.address(tpdu.sca, true);

        var mti = new Buffer(1);
        mti.writeUInt8(
            (tpdu.tpmti & 0x3) |
            ((tpdu.tpmms & 0x1) << 2) |
            ((tpdu.tpsri & 0x01) << 5) |
            ((tpdu.tpudhi & 0x01) << 6) |
            ((tpdu.tprp & 0x01) << 7),
            0);


        var oa = build.address(tpdu.tpoa);

        var pid = new Buffer(1);
        pid.writeUInt8(tpdu.tppid);

        var dcs = new Buffer(1);
        dcs.writeUInt8(tpdu.tpdcs);

        var scts = build.writeTimestamp(tpdu.tpscts);

        var udl = new Buffer(1);
        udl.writeUInt8(tpdu.tpudl);

        var ud = build.write7bit(tpdu.tpud);

        return Buffer.concat([sca, mti, oa, pid, dcs, scts, udl, ud]);
    },
    SMS_SUBMIT: function(tpdu) {
        var sca = build.address(tpdu.sca, true);

        var mti = new Buffer(1);
        mti.writeUInt8(
            (tpdu.tpmti & 0x3) |
            ((tpdu.tprd & 0x1) << 2) |
            ((tpdu.tpvpf & 0x3) << 3) |
            ((tpdu.tpsrr & 0x01) << 5) |
            ((tpdu.tpudhi & 0x01) << 6) |
            ((tpdu.tprp & 0x01) << 7),
            0);

        var mr = new Buffer(1);
        mr.writeUInt8(tpdu.tpmr);

        var da = build.address(tpdu.tpda);

        var pid = new Buffer(1);
        pid.writeUInt8(tpdu.tppid);

        var dcs = new Buffer(1);
        dcs.writeUInt8(tpdu.tpdcs);

        var vp = new Buffer(1);
        vp.writeUInt8(tpdu.tpvp);

        var udl = new Buffer(1);
        udl.writeUInt8(tpdu.tpudl);

        var ud = build.write7bit(tpdu.tpud);

        return Buffer.concat([sca, mti, mr, da, pid, dcs, vp, udl, ud]);
    }
};



/**
 * Builds a T-PDU for the current Builder
 *
 * @returns {String}
 */
Builder.prototype.build = function() {
    var tpdu = builderTable.get(this);

    switch(tpdu.direction) {
        case 'inbound':
            switch(tpdu.tpmti) {
                case constants.SMS_DELIVER:
                    var buffer = build.SMS_DELIVER(tpdu);
                    break
                default:
                    throw new Error("Unsupported TP-MTI: 0x" + tpdu.tpmti.toString(16));
            }
            break;
        case 'outbound':
            switch(tpdu.tpmti) {
                case constants.SMS_SUBMIT:
                    var buffer = build.SMS_SUBMIT(tpdu);
                    break
                default:
                    throw new Error("Unsupported TP-MTI: 0x" + tpdu.tpmti.toString(16));
            }
            break;
    }

    return buffer.toString('hex').toUpperCase();
};


module.exports = Builder;