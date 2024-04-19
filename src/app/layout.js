"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/componets/navbar/Navbar";
import Footer from "@/componets/footer/Footer";
import SessionProvider from './SessionProvider'
import { persistor, store } from '../app/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* session provider */}
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <SessionProvider>
              <Navbar />
              {children}
              {/* footer */}
              <Footer />
            </SessionProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
