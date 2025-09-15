import { Button, Dialog, Flex, SegmentedControl, Text, TextArea, TextField } from "@radix-ui/themes";
import { useBigTextStore } from "./context";
import { useEffect, useRef, useState } from "react";
import { bigTextCanvas } from "./canvas";
import { waitUntil } from "../../utils/wait";
import { trans } from "../../i18n";

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
        <Text>{trans("clickRenderToStart", locale)}</Text>
        <Text>{trans("youCanFullscreenVideoToShow", locale)}</Text>
      </Flex>

      <Flex align="center" justify="center" mb="6">
        <SegmentedControl.Root value={ctx.viewType}>
          <SegmentedControl.Item value="scroll" onClick={() => ctx.setViewType("scroll")}>
            {trans("scrollView", locale)}
          </SegmentedControl.Item>
          <SegmentedControl.Item value="static" onClick={() => ctx.setViewType("static")}>
            {trans("staticView", locale)}
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
        {ctx.viewType === "scroll" && <ScrollViewEditor locale={locale} />}
        {ctx.viewType === "static" && <StaticViewEditor locale={locale} />}
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
        <ShareBtn locale={locale} />
        <Button
          onClick={() => {
            displayVideoRef.current!.controls = true;
            displayVideoRef.current!.play();
            render();
          }}
        >
          {trans("render", locale)}
        </Button>
      </Flex>
    </>
  );
}

function ShareBtn({ locale }: EditorProps) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="gray" variant="soft">
          {trans("shareUrl", locale)}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="calc(100vw - 2rem)" width="420px">
        <Dialog.Title>{trans("shareUrl", locale)}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {trans("youCanShareLink", locale)}
        </Dialog.Description>

        <Text
          as="div"
          color="gray"
          size="2"
          style={{ wordBreak: "break-all", borderLeft: "4px solid var(--gray-6)", paddingLeft: "8px" }}
        >
          {currentUrl}
        </Text>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              {trans("close", locale)}
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>{trans("copyLink", locale)}</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function CommonEditorFields({ locale }: EditorProps) {
  const ctx = useBigTextStore();

  return (
    <>
      <ColorField label={trans("bgColor", locale)} value={ctx.bgColor} onChange={ctx.setBgColor} />
      <ColorField label={trans("textColor", locale)} value={ctx.textColor} onChange={ctx.setTextColor} />
    </>
  );
}

function ScrollViewEditor({ locale }: EditorProps) {
  const ctx = useBigTextStore();

  return (
    <>
      <Field label={trans("text", locale)} value={ctx.text} onChange={ctx.setText} />
      <CommonEditorFields locale={locale} />
      <Field
        label={trans("scrollSpeed", locale)}
        value={ctx.scrollSpeed.toString()}
        onChange={(v) => ctx.setScrollSpeed(Number(v) || 100)}
        selectOnFocus
      />
    </>
  );
}

function StaticViewEditor({ locale }: EditorProps) {
  const ctx = useBigTextStore();

  return (
    <>
      <Field label={trans("text", locale)} value={ctx.text} onChange={ctx.setText} />
      <CommonEditorFields locale={locale} />
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
