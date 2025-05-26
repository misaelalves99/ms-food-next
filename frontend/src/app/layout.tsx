// app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';
import { OrdersProvider } from '../app/context/OrdersContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';

export const metadata = {
  title: 'Meu App',
  description: 'Descrição do meu app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar/>
        <Hero/>
        <OrdersProvider>
          {children}
        </OrdersProvider>
        <Footer/>
      </body>
    </html>
  );
}
