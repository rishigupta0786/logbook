import { Inter } from "next/font/google";
import "./globals.css";
import { PersonsProvider } from "../utils/PersonsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Financial Log Book",
  description: "Track your income and expenses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PersonsProvider>{children}</PersonsProvider>
      </body>
    </html>
  );
}
