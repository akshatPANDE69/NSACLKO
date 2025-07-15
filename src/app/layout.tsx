import ScrollProgressBar from "./components/ScrollProgressBar";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import { Providers } from "./components/Providers";

import "./styles/base.css";
import "./styles/index.css";
import "./styles/register.css";
import "./styles/timeline.css";
import "./styles/tilted-card.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ScrollProgressBar />
        <NavBar />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
