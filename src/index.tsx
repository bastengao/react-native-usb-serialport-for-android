import { Platform } from 'react-native';
import UsbSerialportForAndroid, { Device } from './native_module';
import UsbSerial from './usb_serial';

export { Device, UsbSerial };

interface OpenOptions {
  baudRate: number;
  parity: Parity;
  dataBits: number;
  stopBits: number;
}

export enum Parity {
  None = 0,
  Odd,
  Even,
  Mark,
  Space,
}

export default class UsbSerialManager {
  static list(): Promise<Device[]> {
    return UsbSerialportForAndroid.list();
  }

  static tryRequestPermission(deviceId: number): Promise<void> {
    return UsbSerialportForAndroid.tryRequestPermission(deviceId);
  }

  static open(deviceId: number, options: OpenOptions): Promise<UsbSerial> {
    return UsbSerialportForAndroid.open(deviceId, options.baudRate, options.dataBits, options.stopBits, options.parity)
      .then(() => {
        return new UsbSerial(deviceId);
      });
  }
};
