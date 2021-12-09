import type { EventEmitter } from 'react-native';
import UsbSerialportForAndroid from './native_module';

const DataReceivedEvent = 'usbSerialPortDataReceived';

export interface EventData {
  deviceId: number;
  data: string;
}

export type Listener = (data: EventData) => void;

export default class UsbSerial {
  deviceId: number;
  private eventEmitter: EventEmitter;
  private listeners: Listener[]

  constructor(deviceId: number, eventEmitter: EventEmitter) {
    this.deviceId = deviceId;
    this.eventEmitter = eventEmitter;
    this.listeners = [];
  }

  /**
   * Send data with hex string.
   * 
   * May return error with these codes:
   * * DEVICE_NOT_OPEN
   * * SEND_FAILED
   * 
   * See {@link Codes}
   * @param hexStr 
   * @returns 
   */
  send(hexStr: string): Promise<null> {
    return UsbSerialportForAndroid.send(this.deviceId, hexStr);
  }

  onReceived(listener: Listener) {
    const listenerProxy = (event: EventData) => {
      if (event.deviceId !== this.deviceId) {
        return;
      }
      if (!event.data) {
        return;
      }

      listener(event);
    }

    this.listeners.push(listenerProxy);
    return this.eventEmitter.addListener(DataReceivedEvent, listenerProxy)
  }

  /**
   * 
   * May return error with these codes:
   * * DEVICE_NOT_OPEN_OR_CLOSED
   * 
   * See {@link Codes}
   * @returns 
   */
  close(): Promise<any> {
    for (const listener of this.listeners) {
      this.eventEmitter.removeListener(DataReceivedEvent, listener);
    }
    return UsbSerialportForAndroid.close(this.deviceId);
  }
}
