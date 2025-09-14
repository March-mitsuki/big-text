import { Button, Flex, Switch, Text, TextField } from "@radix-ui/themes";
import { useBigTextStore } from "./context";

export type EditorProps = {
  locale: string;
};
export function Editor({ locale }: EditorProps) {
  const ctx = useBigTextStore();

  return (
    <>
      <Flex align="center" justify="center">
        <Text>进入展示模式后, 点击屏幕三次可返回编辑模式 (或刷新页面)。</Text>
      </Flex>

      <Flex direction="column" gap="2">
        <Field label="Text" value={ctx.text} onChange={ctx.setText} />
        <Field label="Background Color" value={ctx.bgColor} onChange={ctx.setBgColor} />
        <Field label="Text Color" value={ctx.textColor} onChange={ctx.setTextColor} />
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
        }}
      >
        <Button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
          color="gray"
          variant="soft"
        >
          Share
        </Button>
        <Flex align="center" gap="1">
          <Text>Scroll</Text>
          <Switch
            size="3"
            checked={ctx.viewType === "static"}
            onCheckedChange={(checked) => ctx.setViewType(checked ? "static" : "scroll")}
          />
          <Text>Static</Text>
        </Flex>
        <Button
          onClick={() => {
            ctx.setMode("view");
          }}
        >
          Display
        </Button>
      </Flex>
    </>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};
function Field({ label, value, onChange }: FieldProps) {
  return (
    <Flex direction="column" gap="1" asChild>
      <label>
        <Text>{label}</Text>
        <TextField.Root value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </Flex>
  );
}
