import '@plus-store/ui/tokens.css';
import './globals.css';

import type { ReactNode } from 'react';

import { previewMetadata } from '../features/storefront-preview/presentation/preview-metadata';

export const metadata = previewMetadata;

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
