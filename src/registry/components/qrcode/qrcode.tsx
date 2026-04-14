import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeCompProps {
  content: string;
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

const QRCodeComp: React.FC<QRCodeCompProps> = ({
  content,
  width = 200,
  margin = 1,
  darkColor = "#000000",
  lightColor = "#ffffff",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const qrCodeOptions: QRCode.QRCodeToCanvasOptions = {
      width,
      margin,
      color: {
        dark: darkColor,
        light: lightColor,
      },
    };

    interface QrCodeError {
      message: string;
      name: string;
      stack?: string;
    }

    QRCode.toCanvas(
      canvasRef.current as HTMLCanvasElement,
      content,
      qrCodeOptions
    )
      .catch((error: QrCodeError) => {
        console.error("生成二维码失败：", error);
      });
  }, [content, width, margin, darkColor, lightColor]);

  return <canvas ref={canvasRef} id="QRCode" />;
};

export { QRCodeComp };