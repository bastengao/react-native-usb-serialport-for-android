import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import UsbSerialportForAndroid, { Device } from './native_module';
import UsbSerial from './usb_serial';

export { Device, UsbSerial };

const eventEmitter = new NativeEventEmitter(NativeModules.UsbSerialportForAndroid);

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

interface Manager {
  list(): Promise<Device[]>;
  tryRequestPermission(deviceId: number): Promise<void>;
  open(deviceId: number, options: OpenOptions): Promise<UsbSerial>;
}

const UsbSerialManager: Manager = {
  list(): Promise<Device[]> {
    return UsbSerialportForAndroid.list();
  },

  tryRequestPermission(deviceId: number): Promise<void> {
    return UsbSerialportForAndroid.tryRequestPermission(deviceId);
  },

  async open(deviceId: number, options: OpenOptions): Promise<UsbSerial> {
    await UsbSerialportForAndroid.open(deviceId, options.baudRate, options.dataBits, options.stopBits, options.parity);
    return new UsbSerial(deviceId, eventEmitter);
  }
};

const manager: Manager = (Platform.OS == 'android')
 ? UsbSerialManager
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

export default manager;
