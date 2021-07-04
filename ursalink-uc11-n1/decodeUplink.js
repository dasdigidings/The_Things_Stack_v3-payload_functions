// Decoder for URSALINK UC11-N1
// copy&paste to TTN Console V3 -> Applications -> Payload formatters -> Uplink -> Javascript
// modified for The Things Stack V3 by Caspar Armster, dasdigidings e.V.
function decodeUplink(input) {
  var data = {};

  for (i = 0; i < input.bytes.length;) {
    // BATTERY
    if (input.bytes[i] == 0x01) {
      data.battery = input.bytes[i + 2];
      i += 3;
      continue;
    }
    // GPIO
    if (input.bytes[i] == 0x03) {
      data.gpio1 = input.bytes[i + 2] === 0 ? "off" : "on";
      i += 3;
      continue;
    }
    if (input.bytes[i] == 0x04 && input.bytes[i + 1] == 0x00) {
      data.gpio2 = input.bytes[i + 2] === 0 ? "off" : "on";
      i += 3;
      continue;
    }
    //Pulse Counter
    if (input.bytes[i] == 0x04 && input.bytes [i + 1] == 0xc8){
      data.counter = readUInt16LE(input.bytes.slice(i + 2, i + 4)) ;
      i += 4;
      continue;
    }
    // ADC
    if (input.bytes[i] == 0x05) {
      data.adc1 = {};
      data.adc1.cur = readInt16LE(input.bytes.slice(i + 2, i + 4)) / 100;
      data.adc1.min = readInt16LE(input.bytes.slice(i + 4, i + 6)) / 100;
      data.adc1.max = readInt16LE(input.bytes.slice(i + 6, i + 8)) / 100;
      data.adc1.avg = readInt16LE(input.bytes.slice(i + 8, i + 10)) / 100;
      i += 10;
      continue;
    }
    if (input.bytes[i] == 0x06) {
      data.adc2 = {};
      data.adc2.cur = readInt16LE(input.bytes.slice(i + 2, i + 4)) / 100;
      data.adc2.min = readInt16LE(input.bytes.slice(i + 4, i + 6)) / 100;
      data.adc2.max = readInt16LE(input.bytes.slice(i + 6, i + 8)) / 100;
      data.adc2.avg = readInt16LE(input.bytes.slice(i + 8, i + 10)) / 100;
      i += 10;
      continue;
    }
    // MODBUS
    if (input.bytes[i] == 0xFF && input.bytes[i + 1] == 0x0E) {
      var chnId = input.bytes[i + 2];
      var packageType = input.bytes[i + 3];
      var dataType = packageType & 7;
      var dataLength = packageType >> 3;
      var chn = 'chn' + chnId;
      switch (dataType) {
        case 0:
          data[chn] = input.bytes[i + 4] ? "on" : "off";
          i += 5;
          break;
        case 1:
          data[chn] = input.bytes[i + 4];
          i += 5;
          break;
        case 2:
          case 3:
          data[chn] = readUInt16LE(input.bytes.slice(i + 4, i + 6));
          i += 6;
          break;
        case 4:
        case 6:
          data[chn] = readUInt32LE(input.bytes.slice(i + 4, i + 8));
          i += 8;
          break;
        case 5:
        case 7:
          data[chn] = readFloatLE(input.bytes.slice(i + 4, i + 8));
          i += 8;
          break;
      }
    }
  }
  data.bytes = input.bytes;
  data.port = input.fPort;
  return {
    data: data,
    warnings: [],
    errors: []
  };
}

function readUInt8LE(bytes) {
  return (bytes & 0xFF);
}

function readInt8LE(bytes) {
  var ref = readUInt8LE(bytes);
  return (ref > 0x7F) ? ref - 0x100 : ref;
}

function readUInt16LE(bytes) {
  var value = (bytes[1] << 8) + bytes[0];
  return (value & 0xFFFF);
}

function readInt16LE(bytes) {
  var ref = readUInt16LE(bytes);
  return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) {
  var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
  return (value & 0xFFFFFFFF);
}

function readInt32LE(bytes) {
  var ref = readUInt32LE(bytes);
  return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

function readFloatLE(bytes) {
  var bits = bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
  var sign = (bits >>> 31 === 0) ? 1.0 : -1.0;
  var e = bits >>> 23 & 0xff;
  var m = (e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
  var f = sign * m * Math.pow(2, e - 150);
  return f;
}