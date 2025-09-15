import { Button, Flex, SegmentedControl, Text, TextArea, TextField } from "@radix-ui/themes";
import { useBigTextStore } from "./context";
import { useEffect, useRef } from "react";
import { bigTextCanvas } from "./canvas";
import { waitUntil } from "../../utils/wait";

export type EditorProps = {
  locale: string;
};
export function Editor({ locale }: EditorProps) {
  const displayVideoRef = useRef<HTMLVideoElement>(null);
  const ctx = useBigTextStore();

  const render = async () => {
    await waitUntil(() => typeof bigTextCanvas.canvas !== "undefined");
    console.log("viewType changed", ctx.viewType);
    if (ctx.viewType === "scroll") {
      bigTextCanvas.animateScrollText(ctx);
    }
    if (ctx.viewType === "static") {
      bigTextCanvas.displayStaticText(ctx);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!displayVideoRef.current) return;
      await waitUntil(() => typeof bigTextCanvas.canvas !== "undefined");
      const video = displayVideoRef.current;
      video.srcObject = bigTextCanvas.canvas!.captureStream(60);
    };
    init();
  }, []);

  return (
    <>
      <Flex align="center" justify="center" height="calc(100vh * 0.2)">
        <video ref={displayVideoRef} muted height="100%" playsInline></video>
      </Flex>

      <Flex direction="column" align="center" justify="center" my="6" style={{ textAlign: "center" }}>
        <Text>点击下方【渲染】按钮开始渲染结果</Text>
        <Text>结果会以实时视频形式展示, 你可以全屏视频来在任何设备上全屏展示给别人看</Text>
      </Flex>

      <Flex align="center" justify="center" mb="6">
        <SegmentedControl.Root value={ctx.viewType}>
          <SegmentedControl.Item value="scroll" onClick={() => ctx.setViewType("scroll")}>
            Scroll
          </SegmentedControl.Item>
          <SegmentedControl.Item value="static" onClick={() => ctx.setViewType("static")}>
            Static
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </Flex>

      <Flex
        direction="column"
        gap="2"
        pb={{
          initial: "128px",
          md: "64px",
        }}
      >
        {ctx.viewType === "scroll" && <ScrollViewEditor />}
        {ctx.viewType === "static" && <StaticViewEditor />}
      </Flex>

      <Flex
        style={{
          position: "fixed",
          bottom: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100vw - 2rem)",
          border: "1px solid var(--slate-6)",
          borderRadius: "var(--radius-3)",
          padding: "var(--space-2)",
          justifyContent: "center",
          backgroundColor: "var(--slate-1)",
          gap: "var(--space-2)",
          flexWrap: "wrap",
        }}
      >
        <Button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
          color="gray"
          variant="soft"
        >
          Share URL
        </Button>
        <Button
          onClick={() => {
            displayVideoRef.current!.controls = true;
            displayVideoRef.current!.play();
            render();
          }}
        >
          Render
        </Button>
      </Flex>
    </>
  );
}

function CommonEditorFields() {
  const ctx = useBigTextStore();

  return (
    <>
      <ColorField label="Background Color" value={ctx.bgColor} onChange={ctx.setBgColor} />
      <ColorField label="Text Color" value={ctx.textColor} onChange={ctx.setTextColor} />
    </>
  );
}

function ScrollViewEditor() {
  const ctx = useBigTextStore();

  return (
    <>
      <Field label="Text" value={ctx.text} onChange={ctx.setText} />
      <CommonEditorFields />
      <Field
        label="Scroll Speed"
        value={ctx.scrollSpeed.toString()}
        onChange={(v) => ctx.setScrollSpeed(Number(v) || 100)}
        selectOnFocus
      />
    </>
  );
}

function StaticViewEditor() {
  const ctx = useBigTextStore();

  return (
    <>
      <Field label="Text" value={ctx.text} onChange={ctx.setText} />
      <CommonEditorFields />
    </>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  selectOnFocus?: boolean;
  textarea?: boolean;
};
function Field({ label, value, onChange, selectOnFocus, textarea }: FieldProps) {
  return (
    <Flex direction="column" gap="1" asChild>
      <label>
        <Text>{label}</Text>
        {textarea ? (
          <TextArea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={(e) => {
              if (selectOnFocus) {
                e.target.select();
              }
            }}
          />
        ) : (
          <TextField.Root
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={(e) => {
              if (selectOnFocus) {
                e.target.select();
              }
            }}
          />
        )}
      </label>
    </Flex>
  );
}

function ColorField({ label, value, onChange }: FieldProps) {
  return (
    <Flex direction="column" gap="1">
      <Text>{label}</Text>
      <TextField.Root value={value} onChange={(e) => onChange(e.target.value)}>
        <TextField.Slot>
          <input className="color-picker" type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        </TextField.Slot>
      </TextField.Root>
    </Flex>
  );
}
