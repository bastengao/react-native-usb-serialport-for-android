import type { EventEmitter } from 'react-native';
import UsbSerialportForAndroid from './native_module';

const DataReceivedEvent = 'usbSerialPortDataReceived';

interface EventData {
  deviceId: number;
  data: string;
}

type Listener = (data: EventData) => void;

export default class UsbSerial {
  deviceId: number;
  eventEmitter: EventEmitter;
  listeners: Listener[]

  constructor(deviceId: number, eventEmitter: EventEmitter) {
    this.deviceId = deviceId;
    this.eventEmitter = eventEmitter;
    this.listeners = [];
  }

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

  close(): Promise<any> {
    for (const listener of this.listeners) {
      this.eventEmitter.removeListener(DataReceivedEvent, listener);
    }
    return UsbSerialportForAndroid.close(this.deviceId);
  }
}
