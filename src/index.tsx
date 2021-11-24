import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-usb-serialport-for-android' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const UsbSerialportForAndroid = NativeModules.UsbSerialportForAndroid
  ? NativeModules.UsbSerialportForAndroid
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return UsbSerialportForAndroid.multiply(a, b);
}

export interface Device {
  readonly deviceId: number;
  readonly vendorId: number;
  readonly productId: number;
}
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

export default class UsbSerial {
  static list(): Promise<Device[]> {
    console.log('list');
    return UsbSerialportForAndroid.list();
  }
};
