import "antd/dist/reset.css"; // Ant Design styles
import "./globals.css"; // Your global styles
import { Providers } from "@/providers/providers"; // Import your Client Provider component

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
