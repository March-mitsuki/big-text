import { Box, Flex, Spinner, Text } from "@radix-ui/themes";
import { Editor } from "./Editor";
import { Header } from "../Header";
import { loadState, useBigTextStore } from "./context";
import { View } from "./View";
import { useEffect, useState } from "react";

export type HomePageProps = {
  locale: string;
};
export default function HomePage({ locale }: HomePageProps) {
  const mode = useBigTextStore((state) => state.mode);

  useEffect(() => {
    loadState();
  }, []);

  if (mode === "edit") {
    return (
      <main>
        <Header locale={locale} />
        <Box style={{ padding: "64px var(--space-4) var(--space-4) var(--space-4)" }}>
          <Editor locale={locale} />
        </Box>
      </main>
    );
  }

  if (mode === "view") {
    return <View />;
  }

  return (
    <main>
      <Text color="red">ERROR: Invalid mode</Text>
    </main>
  );
}
