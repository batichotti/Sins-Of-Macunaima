import * as bcrypt from 'bcrypt';

export class HashUtil {
  private static readonly SALT_ROUNDS = 12;

  static async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.SALT_ROUNDS);
  }

  static async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}