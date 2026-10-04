import './globals.css';

export const metadata = {
  title: 'Phusion PT & Performance',
  description: 'Client workout and wellness tracking portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
