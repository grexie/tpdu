
var tpdu = require('../index');


describe('Parser', function() {

    it('should parse an SMS-SUBMIT T-PDU', function() {
        var parser = new tpdu.Parser();
        parser.parse("07916407058099F911000A8170607896200000A71554747A0E4ACF416110945805B5CBF379F85C06", 'outbound').should.eql({
            sca: {
                addressType: tpdu.INTERNATIONAL_NUMBER,
                numberingPlan: tpdu.ISDN_NUMBERING_PLAN,
                address: '46705008999'
            },
            direction: 'outbound',
            tpmti: tpdu.SMS_SUBMIT,
            tprd: 0,
            tpvpf: tpdu.RELATIVE_VALIDITY_PERIOD,
            tpsrr: 0,
            tpudhi: 0,
            tprp: 0,
            tpmr: 0,
            tpda: {
                addressType: tpdu.UNKNOWN_NUMBER,
                numberingPlan: tpdu.ISDN_NUMBERING_PLAN,
                address: '0706876902'
            },
            tppid: 0,
            tpdcs: 0,
            tpvp: 0xa7,
            tpudl: 0x15,
            tpud: "This is a PDU message"
        });
    });

    it('should parse an SMS-DELIVER T-PDU', function() {
        var date = new Date();
        date.setUTCFullYear(1999, 9, 12);
        date.setUTCHours(10, 57, 08, 0);

        var parser = new tpdu.Parser();
        parser.parse("07916407058099F9040B916407752743F60000990121017580001554747A0E4ACF416110945805B5CBF379F85C06", 'inbound').should.eql({
            sca: {
                addressType: tpdu.INTERNATIONAL_NUMBER,
                numberingPlan: tpdu.ISDN_NUMBERING_PLAN,
                address: '46705008999'
            },
            direction: 'inbound',
            tpmti: tpdu.SMS_DELIVER,
            tpmms: 1,
            tpsri: 0,
            tpudhi: 0,
            tprp: 0,
            tpoa: {
                addressType: tpdu.INTERNATIONAL_NUMBER,
                numberingPlan: tpdu.ISDN_NUMBERING_PLAN,
                address: '46705772346'
            },
            tppid: 0,
            tpdcs: 0,
            tpscts: date,
            tpudl: 0x15,
            tpud: "This is a PDU message"
        });
    });

    it('should parse an SMS-SUBMIT T-PDU with default SC', function() {
        var parser = new tpdu.Parser();
        parser.parse("0011000A8170607896200000A71554747A0E4ACF416110945805B5CBF379F85C06", 'outbound').should.eql({
            sca: null,
            direction: 'outbound',
            tpmti: tpdu.SMS_SUBMIT,
            tprd: 0,
            tpvpf: tpdu.RELATIVE_VALIDITY_PERIOD,
            tpsrr: 0,
            tpudhi: 0,
            tprp: 0,
            tpmr: 0,
            tpda: {
                addressType: tpdu.UNKNOWN_NUMBER,
                numberingPlan: tpdu.ISDN_NUMBERING_PLAN,
                address: '0706876902'
            },
            tppid: 0,
            tpdcs: 0,
            tpvp: 0xa7,
            tpudl: 0x15,
            tpud: "This is a PDU message"
        });
    });

    it('should parse an SMS-DELIVER T-PDU with default SC', function() {
        var date = new Date();
        date.setUTCFullYear(1999, 9, 12);
        date.setUTCHours(10, 57, 08, 0);

        var parser = new tpdu.Parser();
        parser.parse("00040B916407752743F60000990121017580001554747A0E4ACF416110945805B5CBF379F85C06", 'inbound').should.eql({
            sca: null,
            direction: 'inbound',
            tpmti: tpdu.SMS_DELIVER,
            tpmms: 1,
            tpsri: 0,
            tpudhi: 0,
            tprp: 0,
            tpoa: {
                addressType: tpdu.INTERNATIONAL_NUMBER,
                numberingPlan: tpdu.ISDN_NUMBERING_PLAN,
                address: '46705772346'
            },
            tppid: 0,
            tpdcs: 0,
            tpscts: date,
            tpudl: 0x15,
            tpud: "This is a PDU message"
        });
    });

    it('should roundtrip a T-PDU object', function() {
        tpdu.parse(tpdu.stringify({
            sca: null,
            direction: 'outbound',
            tpmti: tpdu.SMS_SUBMIT,
            tprd: 0,
            tpvpf: tpdu.RELATIVE_VALIDITY_PERIOD,
            tpsrr: 0,
            tpudhi: 0,
            tprp: 0,
            tpmr: 0,
            tpda: {
                addressType: tpdu.UNKNOWN_NUMBER,
                numberingPlan: tpdu.ISDN_NUMBERING_PLAN,
                address: '0706876902'
            },
            tppid: 0,
            tpdcs: 0,
            tpvp: 0xa7,
            tpudl: 0x15,
            tpud: "This is a PDU message"
        }), 'outbound').should.eql({
                sca: null,
                direction: 'outbound',
                tpmti: tpdu.SMS_SUBMIT,
                tprd: 0,
                tpvpf: tpdu.RELATIVE_VALIDITY_PERIOD,
                tpsrr: 0,
                tpudhi: 0,
                tprp: 0,
                tpmr: 0,
                tpda: {
                    addressType: tpdu.UNKNOWN_NUMBER,
                    numberingPlan: tpdu.ISDN_NUMBERING_PLAN,
                    address: '0706876902'
                },
                tppid: 0,
                tpdcs: 0,
                tpvp: 0xa7,
                tpudl: 0x15,
                tpud: "This is a PDU message"
            });
    });

});