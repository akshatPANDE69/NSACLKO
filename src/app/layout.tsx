import NavBar from "./components/navbar";
import Progressbar from "./components/progressbar";
import Footer from "./components/footer";
import SplashCursor from "./components/SplashCursor";
import { Providers } from "./components/Providers";

import "./styles/base.css";
import "./styles/index.css";
import "./styles/register.css";
import "./styles/timeline.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isGamePage =
    typeof window !== "undefined" && window.location.pathname === "/game";

  return (
    <html lang="en">
      <body>
        {!isGamePage && <NavBar />}
        {!isGamePage && <Progressbar />}
        <Providers>{children}</Providers>
        {!isGamePage && <Footer />}
      </body>
    </html>
  );
}
