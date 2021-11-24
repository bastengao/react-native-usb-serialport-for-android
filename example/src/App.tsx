import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import UsbSerial, { Device } from 'react-native-usb-serialport-for-android';

export default function App() {
  const [result, setResult] = React.useState<Device[]>([]);

  React.useEffect(() => {
    UsbSerial.list().then(devices => {
      console.log(devices)
      setResult(devices);
    });
  }, []);

  return (
    <View style={styles.container}>
      {result.map(device => (
        <Text key={device.deviceId}>deviceId: {device.deviceId}, venderId: {device.vendorId}, productId: {device.productId}</Text>
      ))}
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
