import { useEffect, useRef } from "react";
import { useBigTextStore } from "./context";
import { Box } from "@radix-ui/themes";
import { exitFullscreen } from "../../utils/fullscreen";

export function View() {
  const ctx = useBigTextStore();

  useEffect(() => {
    // listen for triple click to go back to edit mode
    let clickCount = 0;
    let lastClickTime = 0;
    const listener = (e: PointerEvent) => {
      const now = Date.now();
      if (now - lastClickTime < 300) {
        clickCount++;
      } else {
        clickCount = 1;
      }
      lastClickTime = now;
      console.log("clickCount", clickCount);

      if (clickCount === 3) {
        setTimeout(() => {
          exitFullscreen();
          ctx.setMode("edit");
        }, 100);
      }
    };

    window.addEventListener("pointerup", listener);

    return () => {
      window.removeEventListener("pointerup", listener);
    };
  }, []);

  if (ctx.viewType === "scroll") {
    return <ScrollView />;
  } else {
    return <StaticView />;
  }
}

const fitSingleLineToBoxHeight = (elem: HTMLElement, startFontSize: number, targetHeight: number) => {
  let fontSize = startFontSize;

  while (true) {
    elem.style.fontSize = `${fontSize}px`;
    const fontHeight = elem.getBoundingClientRect().height;
    if (fontHeight < targetHeight) {
      fontSize *= 1.1;
    } else {
      fontSize *= 0.9;
      break;
    }
  }

  return fontSize;
};

function ScrollView() {
  const ctx = useBigTextStore();
  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentCloneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startFontSize = 100;
    const targetHeight = window.innerHeight;
    const fitText = async () => {
      await document.fonts?.ready;
      const elem = contentRef.current;
      if (!elem) return;
      const newFontSize = fitSingleLineToBoxHeight(elem, startFontSize, targetHeight);
      if (contentCloneRef.current) {
        contentCloneRef.current.style.fontSize = `${newFontSize}px`;
      }
    };

    const speed = 200; // pixels per second
    let lastTS = 0;
    const raf = (ts: DOMHighResTimeStamp) => {
      if (!boxRef.current || !contentRef.current || !contentCloneRef.current) {
        requestAnimationFrame(raf);
        return;
      }

      if (!lastTS) lastTS = ts;
      const dt = (ts - lastTS) / 1000;
      lastTS = ts;
      boxRef.current.scrollLeft += speed * dt;
      if (boxRef.current.scrollLeft >= contentRef.current.offsetWidth) {
        boxRef.current.scrollLeft -= contentRef.current.offsetWidth;
      }
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    fitText();
    window.addEventListener("resize", fitText);
    return () => {
      window.removeEventListener("resize", fitText);
    };
  }, []);

  return (
    <Box
      ref={boxRef}
      style={{
        userSelect: "none",
        width: "100vw",
        maxWidth: "100vw",
        height: "100vh",
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
      }}
    >
      <Box ref={contentRef} pr="calc(100vw / 10)" style={{ display: "inline-block" }}>
        {ctx.text}
      </Box>
      <Box ref={contentCloneRef} pr="calc(100vw / 10)" style={{ display: "inline-block" }}>
        {ctx.text}
      </Box>
    </Box>
  );
}

/**
 * 用二分法把元素字体调到“尽量大且不溢出容器”的值
 * @param el 文字元素
 * @param container 容器元素（高度为目标高度）
 * @param opts 选项
 */
function fitTextToContainer(
  el: HTMLElement,
  container: HTMLElement,
  opts: {
    min?: number; // 最小字号
    max?: number; // 最大字号
    tolerance?: number; // 允许的剩余空间（px），0 表示尽量贴合
    maxIter?: number; // 二分最多迭代次数
    precision?: number; // 最终字号的步进精度（px）
    onStep?: ((info: { mid: number; h: number; targetH: number }) => void) | null; // 可选：每步回调（调试用）
  } = {},
) {
  const { min = 6, max = 1000, tolerance = 0, maxIter = 20, precision = 1, onStep = null } = opts;

  const targetH = container.clientHeight; // 目标高度 = 容器可用高度
  let low = min,
    high = max,
    best = min;

  for (let i = 0; i < maxIter && low <= high; i++) {
    const mid = Math.floor((low + high) / 2 / precision) * precision;
    el.style.fontSize = mid + "px";

    // 用 scrollHeight 测实际内容高度（包含换行）
    const h = el.scrollHeight;
    onStep?.({ mid, h, targetH });

    if (h <= targetH - tolerance) {
      best = mid; // 可以更大
      low = mid + precision;
    } else {
      high = mid - precision;
    }
  }

  el.style.fontSize = best + "px";
  return best;
}
function StaticView() {
  const ctx = useBigTextStore();
  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fitSingleLineToHeight = async () => {
      await document.fonts?.ready;
      if (!contentRef.current || !boxRef.current) return;
      fitTextToContainer(contentRef.current, boxRef.current, {});
    };

    fitSingleLineToHeight();
    window.addEventListener("resize", fitSingleLineToHeight);
    return () => {
      window.removeEventListener("resize", fitSingleLineToHeight);
    };
  }, []);

  return (
    <Box
      ref={boxRef}
      style={{
        userSelect: "none",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
      }}
    >
      <Box ref={contentRef}>{ctx.text}</Box>
    </Box>
  );
}
