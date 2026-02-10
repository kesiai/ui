import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeCompProps {
  content: string;
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
  cellKey: string;
}

const QRCodeComp: React.FC<QRCodeCompProps> = ({
  content,
  width = 200,
  margin = 1,
  darkColor = "#000000",
  lightColor = "#ffffff",
  cellKey,
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

    QRCode.toCanvas(canvasRef.current, content, qrCodeOptions)
      .catch((error) => {
        console.error("生成二维码失败：", error);
      });
  }, [content, width, margin, darkColor, lightColor]);

  return <canvas ref={canvasRef} id={`${cellKey}-QRCode`} />;
};

export default QRCodeComp;