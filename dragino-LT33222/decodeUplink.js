// copy&paste to TTN Console V3 -> Applications -> Payload formatters -> Uplink -> Javascript
// modified for The Things Stack V3 by Caspar Armster, dasdigidings e.V.
// i removed all the calls of the ".toFixed" method, because its a bad practice to transmit number values in strings

function decodeUplink(input) {
    // Payload Formats of LT33222 or LT22222 Deceive
    // For TTN, LoRaServer
    var data = {
        // Hardware type
        Hardware_mode: {
            "0":"LT33222",
            "1":"LT22222",
        }[(input.bytes[10] & 0xC0)>>6],
  
        // Work mode
        Work_mode: {
            "1":"2ACI+2AVI",
            "2":"Count mode 1",
            "3":"2ACI+1Count",
            "4":"Count mode 2",
            "5":"1ACI+2AVI+1Count ",
        }[input.bytes[10] & 0x3f],

        // AVI1 voltage,units:V
        AVI1_V: {
            "1": ((input.bytes[0]<<24>>16 | input.bytes[1])/1000),
            "5": ((input.bytes[0]<<24>>16 | input.bytes[1])/1000),
        }[input.bytes[10] & 0x3f],

        // AVI2 voltage,units:V
        AVI2_V: {
            "1": ((input.bytes[2]<<24>>16 | input.bytes[3])/1000),
            "5": ((input.bytes[2]<<24>>16 | input.bytes[3])/1000),
        }[input.bytes[10] & 0x3f],

        // ACI1 Current,units:mA
        ACI1_mA: {
            "1": ((input.bytes[4]<<24>>16 | input.bytes[5])/1000),
            "3": ((input.bytes[4]<<24>>16 | input.bytes[5])/1000),
            "5": ((input.bytes[4]<<24>>16 | input.bytes[5])/1000),
        }[input.bytes[10] & 0x3f],

        // ACI2 Current,units:mA
        ACI2_mA: {
            "1": ((input.bytes[6]<<24>>16 | input.bytes[7])/1000),
            "3": ((input.bytes[6]<<24>>16 | input.bytes[7])/1000),
        }[input.bytes[10] & 0x3f],
    
        // Count1,units:times;
        Count1_times: {
            "2": ( input.bytes[0]<<24 | input.bytes[1]<<16 | input.bytes[2]<<8 | input.bytes[3]),
            "3": ( input.bytes[0]<<24 | input.bytes[1]<<16 | input.bytes[2]<<8 | input.bytes[3]),
            "4": ( input.bytes[0]<<24 | input.bytes[1]<<16 | input.bytes[2]<<8 | input.bytes[3]),
            "5":( input.bytes[6]<<8 | input.bytes[7]),
        }[input.bytes[10] & 0x3f],

        // Count2,units:times;
        Count2_times: {
            "2": ( input.bytes[4]<<24 | input.bytes[5]<<16 | input.bytes[6]<<8 | input.bytes[7]),
        }[input.bytes[10] & 0x3f],

        // ACount,units:times;
        Acount_times: {
            "4":( input.bytes[4]<<24 | input.bytes[5]<<16 | input.bytes[6]<<8 | input.bytes[7]),
        }[input.bytes[10] & 0x3f],

        // First - First payload for join network
        First_status: {
            "2":( input.bytes[8] &0x20)? "Yes":"No",
            "3":( input.bytes[8] &0x20)? "Yes":"No",
            "4":( input.bytes[8] &0x20)? "Yes":"No",
            "5":( input.bytes[8] &0x20)? "Yes":"No",
        }[input.bytes[10] & 0x3f],

        // DO1 - Digital Output Status
        DO1_status: {
            "1":( input.bytes[8] &0x01)? "L":"H",
            "2":( input.bytes[8] &0x01)? "L":"H",
            "3":( input.bytes[8] &0x01)? "L":"H",
            "4":( input.bytes[8] &0x01)? "L":"H",
            "5":( input.bytes[8] &0x01)? "L":"H",
        }[input.bytes[10] & 0x3f],

        // DO2 - Digital Output Status
        DO2_status: {
            "1":( input.bytes[8] &0x02)? "L":"H",
            "2":( input.bytes[8] &0x02)? "L":"H",
            "3":( input.bytes[8] &0x02)? "L":"H",
            "4":( input.bytes[8] &0x02)? "L":"H",
            "5":( input.bytes[8] &0x02)? "L":"H",
        }[input.bytes[10] & 0x3f],

        // DO3 - Digital Output Status
        DO3_status: {
            "1":( input.bytes[8] &0x04)? "L":"H",
            "2":( input.bytes[8] &0x04)? "L":"H",
            "3":( input.bytes[8] &0x04)? "L":"H",
            "4":( input.bytes[8] &0x04)? "L":"H",
            "5":( input.bytes[8] &0x04)? "L":"H",
        }[input.bytes[10] & 0xff],

        // DI1 - Digital Input Status
        DI1_status: {
            "1":( input.bytes[8] &0x08)? "H":"L",
        }[input.bytes[10] & 0x3f],

        // DI2 - Digital Input Status
        DI2_status: {
            "1":( input.bytes[8] &0x10)? "H":"L",
        }[input.bytes[10] & 0x3f],

        // DI3 - Digital Input Status
        DI3_status: {
            "1": ( input.bytes[8] &0x20)? "H":"L",
        }[input.bytes[10] & 0xff],

        // RO1 - Relay Status
        RO1_status: {
            "1":( input.bytes[8] &0x80)? "ON":"OFF",
            "2":( input.bytes[8] &0x80)? "ON":"OFF",
            "3":( input.bytes[8] &0x80)? "ON":"OFF",
            "4":( input.bytes[8] &0x80)? "ON":"OFF",
            "5":( input.bytes[8] &0x80)? "ON":"OFF",      
        }[input.bytes[10] & 0x3f],

        // RO2 - Relay Status
        RO2_status: {
            "1":( input.bytes[8] &0x40)? "ON":"OFF",
            "2":( input.bytes[8] &0x40)? "ON":"OFF",
            "3":( input.bytes[8] &0x40)? "ON":"OFF",
            "4":( input.bytes[8] &0x40)? "ON":"OFF",
            "5":( input.bytes[8] &0x40)? "ON":"OFF",
        }[input.bytes[10] & 0x3f],
    };

    data.bytes = input.bytes;
    data.port = input.fPort;
    return {
        data: data,
        warnings: [],
        errors: []
    };
}