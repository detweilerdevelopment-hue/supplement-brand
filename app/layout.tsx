import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: 'aevra — A little ritual. A fuller life.',
  description: 'Meet aevra. A thoughtful new approach to everyday supplements. Join our prelaunch list for first access and a look behind the formula.',
  openGraph: { title: 'aevra — Make room for feeling good.', description: 'Your everyday ritual, reimagined. Be first to meet aevra.', images: ['/aevra-blue.webp'] },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
