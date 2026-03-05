import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { APP_CONFIG } from "@/config/app";

export function generateSecret(email) {
  const totp = new OTPAuth.TOTP({
    issuer: APP_CONFIG.totp.issuer,
    label: email,
    algorithm: APP_CONFIG.totp.algorithm,
    digits: APP_CONFIG.totp.digits,
    period: APP_CONFIG.totp.period,
    secret: OTPAuth.Secret.defaultSize
      ? new OTPAuth.Secret()
      : new OTPAuth.Secret({ size: 20 }),
  });

  return {
    secret: totp.secret.base32,
    otpauthUrl: totp.toString(),
  };
}

export function verifyTOTP(secret, token) {
  const totp = new OTPAuth.TOTP({
    issuer: APP_CONFIG.totp.issuer,
    algorithm: APP_CONFIG.totp.algorithm,
    digits: APP_CONFIG.totp.digits,
    period: APP_CONFIG.totp.period,
    secret: OTPAuth.Secret.fromBase32(secret),
  });

  const delta = totp.validate({ token, window: 2 });
  return delta !== null;
}

export async function generateQRCode(otpauthUrl) {
  try {
    const dataUrl = await QRCode.toDataURL(otpauthUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    return dataUrl;
  } catch {
    return null;
  }
}
