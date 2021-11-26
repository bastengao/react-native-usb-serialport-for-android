import UsbSerialportForAndroid from './native_module';

export default class UsbSerial {
  deviceId: number;

  constructor(deviceId: number) {
    this.deviceId = deviceId;
  }

  send(hexStr: string): Promise<null> {
    return UsbSerialportForAndroid.send(this.deviceId, hexStr);
  }

  onReceived() {
    // TODO: implement
  }

  close(): Promise<any> {
    return UsbSerialportForAndroid.close(this.deviceId);
  }
}
