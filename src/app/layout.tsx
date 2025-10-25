import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'P2P TrustMarket',
  description: 'A trusted, local P2P marketplace with transparent smart-contract escrow.',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
