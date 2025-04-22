import { ReactNode } from 'react';
import './globals.css'; // Include your global styles

export const metadata = {
  title: 'Wooden Boards Optimizer',
  description: 'An engineering app for optimizing wooden board placement in containers',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}