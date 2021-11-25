package com.bastengao.usbserialport;

import com.hoho.android.usbserial.driver.UsbSerialPort;

import java.io.IOException;

public class UsbSerialPortWrapper {
    private UsbSerialPort port;

    UsbSerialPortWrapper(UsbSerialPort port) {
        this.port = port;
    }

    public void close() {
        try {
            port.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
