import "./globals.css";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Providers } from "../providers/customProvider";

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
