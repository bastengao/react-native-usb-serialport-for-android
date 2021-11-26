package com.bastengao.usbserialport;

import com.hoho.android.usbserial.driver.UsbSerialPort;

import java.io.IOException;

public class UsbSerialPortWrapper {
    private UsbSerialPort port;
    private boolean closed = false;

    UsbSerialPortWrapper(UsbSerialPort port) {
        this.port = port;
    }

    public void close() {
        if (closed) {
            return;
        }

        this.closed = true;
        try {
            port.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
