import "./style.css";

import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <Theme>{children}</Theme>
    </ThemeProvider>
  );
}
