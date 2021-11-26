package com.bastengao.usbserialport;

import com.facebook.react.bridge.Promise;
import com.hoho.android.usbserial.driver.UsbSerialPort;

import java.io.IOException;

public class UsbSerialPortWrapper {
    private static final int WRITE_WAIT_MILLIS = 2000;
    private static final int READ_WAIT_MILLIS = 2000;

    private UsbSerialPort port;
    private boolean closed = false;

    UsbSerialPortWrapper(UsbSerialPort port) {
        this.port = port;
    }

    public void send(byte[] data) throws IOException {
        this.port.write(data, WRITE_WAIT_MILLIS);
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
