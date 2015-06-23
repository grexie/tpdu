
var tpdu = require('../index');

describe('Builder', function() {

    it('should build an SMS-SUBMIT T-PDU', function() {
        var builder = new tpdu.Builder();

        builder.sca(tpdu.INTERNATIONAL_NUMBER, tpdu.ISDN_NUMBERING_PLAN, '46705008999');
        builder.direction('outbound');
        builder.tpmti(tpdu.SMS_SUBMIT);
        builder.tprd(0);
        builder.tpvpf(tpdu.RELATIVE_VALIDITY_PERIOD);
        builder.tpsrr(0);
        builder.tpudhi(0);
        builder.tprp(0);
        builder.tpmr(0);
        builder.tpda(tpdu.UNKNOWN_NUMBER, tpdu.ISDN_NUMBERING_PLAN, '0706876902');
        builder.tppid(0);
        builder.tpdcs(0);
        builder.tpvp(0xa7);
        builder.tpudl(0x15);
        builder.tpud("This is a PDU message");

        builder.build().should.eql("07916407058099F911000A8170607896200000A71554747A0E4ACF416110945805B5CBF379F85C06");
    });

    it('should build an SMS-DELIVER T-PDU', function() {
        var builder = new tpdu.Builder();

        builder.sca(tpdu.INTERNATIONAL_NUMBER, tpdu.ISDN_NUMBERING_PLAN, '46705008999');
        builder.direction('inbound');
        builder.tpmti(tpdu.SMS_DELIVER);
        builder.tpmms(1);
        builder.tpsri(0);
        builder.tpudhi(0);
        builder.tprp(0);
        builder.tpoa(tpdu.INTERNATIONAL_NUMBER, tpdu.ISDN_NUMBERING_PLAN, '46705772346');
        builder.tpmr(0);
        builder.tppid(0);
        builder.tpdcs(0);
        var date = new Date();
        date.setUTCFullYear(1999, 9, 12);
        date.setUTCHours(10, 57, 08, 0);
        builder.tpscts(date);
        builder.tpudl(0x15);
        builder.tpud("This is a PDU message");

        builder.build().should.eql("07916407058099F9040B916407752743F60000990121017580001554747A0E4ACF416110945805B5CBF379F85C06");
    });

    it('should build an SMS-SUBMIT T-PDU with default SC', function() {
        var builder = new tpdu.Builder();

        builder.sca(tpdu.INTERNATIONAL_NUMBER, tpdu.ISDN_NUMBERING_PLAN, '');
        builder.direction('outbound');
        builder.tpmti(tpdu.SMS_SUBMIT);
        builder.tprd(0);
        builder.tpvpf(tpdu.RELATIVE_VALIDITY_PERIOD);
        builder.tpsrr(0);
        builder.tpudhi(0);
        builder.tprp(0);
        builder.tpmr(0);
        builder.tpda(tpdu.UNKNOWN_NUMBER, tpdu.ISDN_NUMBERING_PLAN, '0706876902');
        builder.tppid(0);
        builder.tpdcs(0);
        builder.tpvp(0xa7);
        builder.tpudl(0x15);
        builder.tpud("This is a PDU message");

        builder.build().should.eql("0011000A8170607896200000A71554747A0E4ACF416110945805B5CBF379F85C06");
    });

    it('should build an SMS-DELIVER T-PDU with default SC', function() {
        var builder = new tpdu.Builder();

        builder.sca(tpdu.UNKNOWN_NUMBER, tpdu.UNKNOWN_NUMBERING_PLAN, '');
        builder.direction('inbound');
        builder.tpmti(tpdu.SMS_DELIVER);
        builder.tpmms(1);
        builder.tpsri(0);
        builder.tpudhi(0);
        builder.tprp(0);
        builder.tpoa(tpdu.INTERNATIONAL_NUMBER, tpdu.ISDN_NUMBERING_PLAN, '46705772346');
        builder.tpmr(0);
        builder.tppid(0);
        builder.tpdcs(0);
        var date = new Date();
        date.setUTCFullYear(1999, 9, 12);
        date.setUTCHours(10, 57, 08, 0);
        builder.tpscts(date);
        builder.tpudl(0x15);
        builder.tpud("This is a PDU message");

        builder.build().should.eql("00040B916407752743F60000990121017580001554747A0E4ACF416110945805B5CBF379F85C06");
    });

    it('should roundtrip a T-PDU string', function() {
        tpdu.stringify(tpdu.parse("00040B916407752743F60000990121017580001554747A0E4ACF416110945805B5CBF379F85C06", 'inbound')).should.eql("00040B916407752743F60000990121017580001554747A0E4ACF416110945805B5CBF379F85C06");
    });

});