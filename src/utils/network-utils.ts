// Network utility untuk detect koneksi internet
import NetInfo from '@react-native-community/netinfo';

export class NetworkService {
  private static listeners: ((isConnected: boolean) => void)[] = [];
  private static isConnected: boolean = true;

  static init() {
    NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable !== false;
      if (connected !== this.isConnected) {
        this.isConnected = connected;
        this.notifyListeners(connected);
      }
    });
  }

  static async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable !== false;
  }

  static getConnectionStatus(): boolean {
    return this.isConnected;
  }

  static subscribe(callback: (isConnected: boolean) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private static notifyListeners(isConnected: boolean) {
    this.listeners.forEach(listener => listener(isConnected));
  }
}
