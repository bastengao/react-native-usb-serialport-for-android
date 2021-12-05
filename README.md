# react-native-usb-serialport-for-android

React Native USB serialport module for Android platform based on [mik3y/usb-serial-for-android](https://github.com/mik3y/usb-serial-for-android)

## Installation

```sh
npm install react-native-usb-serialport-for-android --save
```

## Usage

```js
import { UsbSerialManager, Parity } from "react-native-usb-serialport-for-android";

// ...
const devices = await UsbSerialManager.list();

try {
  await UsbSerialManager.tryRequestPermission(2004);
  const usbSerialport = await UsbSerialManager.open(2004, { baudRate: 38400, parity: Parity.None, dataBits: 8, stopBits: 1 });

  const sub = usbSerialport.onReceived((event) => {
    console.log(event.deviceId, event.data);
  });
  // unsubscribe
  // sub.remove();

  await usbSerialport.send('00FF');
  
  usbSerialport.close();
} catch(err) {
  console.log(err);
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
