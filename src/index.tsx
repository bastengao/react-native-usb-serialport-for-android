import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import UsbSerialportForAndroid, { Device } from './native_module';
import UsbSerial from './usb_serial';

export { Device, UsbSerial };
export { Listener, EventData } from "./usb_serial";

const eventEmitter = new NativeEventEmitter(NativeModules.UsbSerialportForAndroid);

export interface OpenOptions {
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

export interface Manager {
  list(): Promise<Device[]>;
  tryRequestPermission(deviceId: number): Promise<null>;
  open(deviceId: number, options: OpenOptions): Promise<UsbSerial>;
}

const defaultManager: Manager = {
  list(): Promise<Device[]> {
    return UsbSerialportForAndroid.list();
  },

  tryRequestPermission(deviceId: number): Promise<null> {
    return UsbSerialportForAndroid.tryRequestPermission(deviceId);
  },

  async open(deviceId: number, options: OpenOptions): Promise<UsbSerial> {
    await UsbSerialportForAndroid.open(deviceId, options.baudRate, options.dataBits, options.stopBits, options.parity);
    return new UsbSerial(deviceId, eventEmitter);
  }
};

export const UsbSerialManager: Manager = (Platform.OS == 'android')
 ? defaultManager
 : (new Proxy(
    {},
    {
      get() {
        return () => {
          throw new Error(`Not support ${Platform.OS}`);
        }
      },
    }
  )) as Manager;
