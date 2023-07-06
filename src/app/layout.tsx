import "./globals.css";
import { Providers } from "../providers/providers";
import { Provider } from "react-redux";

export const metadata = {
  title: "Sige INICIO",
  description: "Sistema de gestión del grupo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
