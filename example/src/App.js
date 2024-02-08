import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { UsbSerialManager, Device, UsbSerial, Parity, Codes } from 'react-native-usb-serialport-for-android';

import { NativeModules, DeviceEventEmitter, NativeEventEmitter } from 'react-native';


export default function App() {
  const [result, setResult] = useState([]);
  const usbSerialport = useRef(null);

  const usbEventEmitter = new NativeEventEmitter(UsbSerialManager);
  const [attachedDevice, setAttachedDevice] = useState(null);
  const [detachedDevice, setDetachedDevice] = useState(null);
  const [isDeviceAttached, setIsDeviceAttached] = useState(false);


  useEffect(() => {
    
    const attachSubscription = usbEventEmitter.addListener('UsbDeviceAttached', () => {
      setIsDeviceAttached(true);
    });

    
    const detachSubscription = usbEventEmitter.addListener('UsbDeviceDetached', () => {
      setIsDeviceAttached(false);
    });

    
    return () => {
      attachSubscription.remove();
      detachSubscription.remove();
    };
  }, []);
  

  useEffect(() => {
    UsbSerialManager.list().then(devices => {
      console.log(devices);
      setResult(devices);
    });
  }, []);

  return (
    <View style={styles.container}>

      {isDeviceAttached ? (
        <Text>USB Device Attached</Text>
      ) : (
        <Text>USB Device Detached</Text>
      )}


      {result.map(device => (
        <Text key={device.deviceId}>deviceId: {device.deviceId}, vendorId: {device.vendorId}, productId: {device.productId}</Text>
      ))}

      <Button title="request usb permission" onPress={async () => {
        try {
          await UsbSerialManager.tryRequestPermission(result[0]?.deviceId);
        } catch (err) {
          console.log(err);
        }
      }} />

      <Button title="open" onPress={async () => {
        try {
          usbSerialport.current = await UsbSerialManager.open(result[0]?.deviceId, { baudRate: 19200, parity: Parity.None, dataBits: 8, stopBits: 1 });
          console.log("open success");
        } catch (err) {
          console.log(err);
        }

        const sub = usbSerialport.current?.onReceived((event) => {
          console.log(event.deviceId, event.data);
        });
      }} />

      <Button title="close" onPress={async () => {
        try {
          await usbSerialport.current?.close();
        } catch (err) {
          console.log(err);
        }
        console.log("close success");
      }} />

      <Button title="send" onPress={async () => {
        console.log("Sending: 41540D0A");
        const result = await usbSerialport.current?.send("41542B4944");
        console.log(JSON.stringify(result));
      }} />

      <Button title="list" onPress={async () => {
        UsbSerialManager.list().then(devices => {
          console.log(devices);
          setResult(devices);
        });
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
});
