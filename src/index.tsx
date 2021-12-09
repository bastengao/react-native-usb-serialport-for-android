import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import UsbSerialportForAndroid, { Device } from './native_module';
import UsbSerial from './usb_serial';

export { Device, UsbSerial };
export { Listener, EventData } from "./usb_serial";

const {
  CODE_DEVICE_NOT_FOND,
  CODE_DRIVER_NOT_FOND,
  CODE_NOT_ENOUGH_PORTS,
  CODE_PERMISSION_DENIED,
  CODE_OPEN_FAILED,
  CODE_DEVICE_NOT_OPEN,
  CODE_SEND_FAILED,
  CODE_DEVICE_NOT_OPEN_OR_CLOSED,
} = NativeModules.UsbSerialportForAndroid.getConstants();

export const Codes = {
  DEVICE_NOT_FOND: CODE_DEVICE_NOT_FOND,
  DRIVER_NOT_FOND: CODE_DRIVER_NOT_FOND,
  NOT_ENOUGH_PORTS: CODE_NOT_ENOUGH_PORTS,
  PERMISSION_DENIED: CODE_PERMISSION_DENIED,
  OPEN_FAILED: CODE_OPEN_FAILED,
  DEVICE_NOT_OPEN: CODE_DEVICE_NOT_OPEN,
  SEND_FAILED: CODE_SEND_FAILED,
  DEVICE_NOT_OPEN_OR_CLOSED: CODE_DEVICE_NOT_OPEN_OR_CLOSED,
};

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
  /**
   * Return true if already has permission, otherwise will request permission and return false.
   * 
   * May return error with these codes:
   * * DEVICE_NOT_FOND
   * 
   * See {@link Codes}
   * @param deviceId
   */
  tryRequestPermission(deviceId: number): Promise<boolean>;
  /**
   * May return error with these codes:
   * * DEVICE_NOT_FOND
   * 
   * See {@link Codes}
   * @param deviceId 
   */
  hasPermission(deviceId: number): Promise<boolean>;
  /**
   * May return error with these codes:
   * * DEVICE_NOT_FOND
   * * DRIVER_NOT_FOND
   * * NOT_ENOUGH_PORTS
   * * PERMISSION_DENIED
   * * OPEN_FAILED
   * 
   * See {@link Codes}
   * @param deviceId 
   * @param options 
   */
  open(deviceId: number, options: OpenOptions): Promise<UsbSerial>;
}

const defaultManager: Manager = {
  list(): Promise<Device[]> {
    return UsbSerialportForAndroid.list();
  },

  async tryRequestPermission(deviceId: number): Promise<boolean> {
     const result = await UsbSerialportForAndroid.tryRequestPermission(deviceId);
     return result === 1;
  },

  hasPermission(deviceId: number): Promise<boolean> {
    return UsbSerialportForAndroid.hasPermission(deviceId);
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
