import './globals.css';
import Header from './layout/partial/Header';
import Footer from './layout/partial/Footer';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <ToastContainer position="top-right" autoClose={5000} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}