import * as jwt from 'jsonwebtoken';
import * as QRCode from 'qrcode';

// Pass the secret as a parameter from service
export function generateJoinToken(
  joinCode: string,
  userId: string,
  experienceId: string,
  expiresAt: Date,
  jwtSecret: string, // Add secret param here
) {
  return jwt.sign({ joinCode, userId, experienceId }, jwtSecret, {
    expiresIn: Math.floor((expiresAt.getTime() - Date.now()) / 1000),
  });
}

export async function generateQRCode(data: string): Promise<string> {
  return (await QRCode.toDataURL(data)) as string;
}
