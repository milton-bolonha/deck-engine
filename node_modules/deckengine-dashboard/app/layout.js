import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { DashboardProvider } from "../contexts/DashboardContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DeckEngine Dashboard - NÜktpls",
  description: "Sistema administrativo completo com pipeline builder visual",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <meta charSet="UTF-8" />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-deck-bg`}>
        <DashboardProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1e293b",
                color: "#f1f5f9",
                border: "1px solid #334155",
              },
              success: {
                iconTheme: {
                  primary: "#4ADE80",
                  secondary: "#1e293b",
                },
              },
              error: {
                iconTheme: {
                  primary: "#F87171",
                  secondary: "#1e293b",
                },
              },
            }}
          />
        </DashboardProvider>
      </body>
    </html>
  );
}
