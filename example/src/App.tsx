import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import UsbSerialManager, { Device, UsbSerial, Parity } from 'react-native-usb-serialport-for-android';

export default function App() {
  const [result, setResult] = React.useState<Device[]>([]);
  const usbSerialport =  React.useRef<UsbSerial | null>(null);

  React.useEffect(() => {
    UsbSerialManager.list().then(devices => {
      console.log(devices)
      setResult(devices);
    });
  }, []);

  return (
    <View style={styles.container}>
      {result.map(device => (
        <Text key={device.deviceId}>deviceId: {device.deviceId}, venderId: {device.vendorId}, productId: {device.productId}</Text>
      ))}

      <Button title="request usb permission" onPress={async () => {
        try {
          await UsbSerialManager.tryRequestPermission(2004);
        } catch(err) {
          console.log(err);
        }
      }} />
      <Button title="open" onPress={async () => {
        try {
          usbSerialport.current = await UsbSerialManager.open(2004, { baudRate: 38400, parity: Parity.None, dataBits: 8, stopBits: 1 });
          console.log("open success")
        } catch(err) {
          console.log(err);
        }
      }} />
      <Button title="close" onPress={async () => {
        try {
          await usbSerialport.current?.close();
        } catch(err) {
          console.log(err);
        }
        console.log("close success")
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
