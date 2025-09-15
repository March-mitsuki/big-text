import { Box } from "@radix-ui/themes";
import { Editor } from "./Editor";
import { Header } from "../Header";
import { loadState } from "./context";
import { useEffect, useRef } from "react";
import { bigTextCanvas } from "./canvas";

export type HomePageProps = {
  locale: string;
};
export default function HomePage({ locale }: HomePageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    loadState();
    bigTextCanvas.init(canvasRef.current);
    bigTextCanvas.fitCanvasSize();
  }, []);

  return (
    <main>
      <canvas ref={canvasRef} id="big-text-canvas" hidden />
      <Header locale={locale} />
      <Box style={{ padding: "64px var(--space-4) var(--space-4) var(--space-4)" }}>
        <Editor locale={locale} />
      </Box>
    </main>
  );
}
