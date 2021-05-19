// copy&paste to TTN Console V3 -> Applications -> Payload formatters -> Uplink -> Javascript
// modified for The Things Stack V3 by Caspar Armster, dasdigidings e.V.
// i removed all the calls of the ".toFixed" method, because its a bad practice to transmit number values in strings

function decodeUplink(input) {
    // create the object to collect the data for returning the decoded payload
    var data = {
        "bytes": input.bytes, // original payload
        "port" : input.fPort  // lorawan port
    };

    // External sensor
    data.Ext_sensor = {
        "0":"No external sensor",
        "1":"Temperature Sensor",
        "4":"Interrupt Sensor send",
        "5":"Illumination Sensor",
        "6":"ADC Sensor",
        "7":"Interrupt Sensor count",
    }[input.bytes[6]&0x7F];
       
    // Battery,units:V
    data.BatV = ((input.bytes[0]<<8 | input.bytes[1]) & 0x3FFF)/1000;
    data.BatV_unit = "V";

    // SHT20,temperature,units:℃
    data.TempCSHT = ((input.bytes[2]<<24>>16 | input.bytes[3])/100);
    data.TempCSHT_unit = "°C";

    // SHT20,Humidity,units:%
    data.HumSHT = ((input.bytes[4]<<8 | input.bytes[5])/10);
    data.HumSHT_unit = "%";

    // DS18B20,temperature,units:℃
    data.TempCDS = {
        "1":((input.bytes[7]<<24>>16 | input.bytes[8])/100),
    }[input.bytes[6]&0xFF];       
    data.TempCDS_unit = "°C";

    // Exti pin level,PA4
    data.Exti_pin_level = {
        "4":input.bytes[7] ? "High":"Low",
    }[input.bytes[6]&0x7F];
       
    // Exit pin status,PA4
    data.Exti_status = {
        "4":input.bytes[8] ? "True":"False",
    }[input.bytes[6]&0x7F];
       
    // BH1750,illumination,units:lux
    data.ILLlux = {
        "5":input.bytes[7]<<8 | input.bytes[8],
    }[input.bytes[6]&0x7F];
        
    // ADC,PA4,units:V
    data.ADC = {
        "6":(input.bytes[7]<<8 | input.bytes[8])/1000,
    }[input.bytes[6]&0x7F];
    data.ADC_unit = "V";

    // Exti count,PA4,units:times
    data.ExitCount = {
        "7":input.bytes[7]<<8 | input.bytes[8],
    }[input.bytes[6]&0x7F];
    data.ExitCount_unit = "#";

    // Applicable to working mode 4567,and working mode 467 requires short circuit PA9 and PA10
    data.No_connect = {
        "1":"Sensor no connection",
    }[(input.bytes[6]&0x80)>>7];
    
    return {
        data: data,
        warnings: [],
        errors: []
    };
}