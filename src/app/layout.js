import { AuthProvider } from "@/features/auth/auth.context";
import "./globals.css";

export const metadata = {
  title: "SaaS Admin Boilerplate",
  description: "Production-ready SaaS Admin template with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
