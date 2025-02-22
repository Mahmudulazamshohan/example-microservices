import CryptoJS from 'crypto-js';
import process from 'process';

export class SecureStorage {
  private static readonly SECRET_KEY: string = process.env.STORAGE_KEY || 'key';

  public static setItem(key: string, value: string): void {
    const encrypted = CryptoJS.AES.encrypt(value, this.SECRET_KEY).toString();
    localStorage.setItem(key, encrypted);
  }

  public static getItem(key: string): string | null {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, this.SECRET_KEY);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  public static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public static clear(): void {
    localStorage.clear();
  }
}
