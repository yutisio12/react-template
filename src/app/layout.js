import { AuthProvider } from "@/features/auth/auth.context";
import "./globals.css";

export const metadata = {
  title: "SaaS Admin Boilerplate",
  description: "Production-ready SaaS Admin template with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
