import "./globals.css";

export const metadata = {
  title: "Sige INICIO",
  description: "Sistema de gestión del grupo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
