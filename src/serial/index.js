import { ElMessageBox, ElNotification  } from 'element-plus';

class WebSerial {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isConnected = false;
    this.receivedData = '';
  }

  async connect(baudRate) {
    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: baudRate });
      this.isConnected = true;
      this.reader = this.port.readable.getReader();
      this.writer = this.port.writable.getWriter();
      this.readData();
    } catch (error) {
      ElMessageBox.alert('error: ' + error.message, 'Connection Error', {
        confirmButtonText: 'OK',
        type: 'error'
      });
    }
  }

  async disconnect() {
    if (this.reader) {
      await this.reader.cancel();
      await this.reader.releaseLock();
      this.reader = null;
    }
    if (this.writer) {
      await this.writer.close();
      await this.writer.releaseLock();
      this.writer = null;
    }
    if (this.port) {
      await this.port.close();
      this.port = null;
    }
    this.isConnected = false;
  }

  async sendMessage(message) {
    this.clearReceivedData();
    const data = new TextEncoder().encode(message);
    await this.writer.write(data);
    return await this.waitForResponse();
  }

  async waitForResponse(timeout = 3000) {
    const startTime = Date.now();
    while (Date.now() - startTime <= timeout) {
      if (this.receivedData) {
        const response = this.receivedData.trim(); // 去掉前后空白
        console.log("Received response:", response, Date.now(), startTime, timeout, Date.now() - startTime);
        if (!response.endsWith('$')) {
          this.clearReceivedData();
          continue;
        }
        if (response.endsWith('$OK$')) {
          return 'OK';
        } else {
          ElNotification({
            title: 'Warning',
            message: 'send failed!',
            type: 'warning',
          });
          return 'FAILED';
        }
      }
      await new Promise(resolve => setTimeout(resolve, 50)); // 等待50ms
    }
    ElNotification({
      title: 'Warning',
      message: 'send failed!',
      type: 'warning',
    });
    throw new Error('Timeout waiting for response');
  }

  async readData() {
    while (this.isConnected) {
      try {
        const { value, done } = await this.reader.read();
        if (done) {
          break;
        }
        this.receivedData += new TextDecoder().decode(value);
      } catch (error) {
        console.error('Error reading data:', error);
        break;
      }
    }
  }

  getReceivedData() {
    let data = this.receivedData;
    this.clearReceivedData();
    return data;
  }

  clearReceivedData() {
    this.receivedData = '';
  }
}

const webSerial = new WebSerial();
export {
  webSerial
};
