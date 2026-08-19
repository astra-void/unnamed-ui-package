import { TabsContent } from "./Tabs/TabsContent";
import { TabsList } from "./Tabs/TabsList";
import { TabsRoot } from "./Tabs/TabsRoot";
import { TabsTrigger } from "./Tabs/TabsTrigger";

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
} as const satisfies {
  Root: typeof TabsRoot;
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
};

export { useTabsContext } from "./Tabs/context";
export type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps } from "./Tabs/types";
export { TabsContent, TabsList, TabsRoot, TabsTrigger };
