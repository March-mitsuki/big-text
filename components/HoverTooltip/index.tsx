import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { HoverCard } from "@radix-ui/themes";

export type HoverTooltipProps = {
  content: React.ReactNode;
};
export function HoverTooltip({ content }: HoverTooltipProps) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <QuestionMarkCircledIcon />
      </HoverCard.Trigger>
      <HoverCard.Content maxWidth="300px">{content}</HoverCard.Content>
    </HoverCard.Root>
  );
}
