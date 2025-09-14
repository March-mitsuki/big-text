import { create } from "zustand";

export type BigTextStore = {
  mode: "edit" | "view";
  setMode: (mode: "edit" | "view") => void;

  text: string;
  setText: (text: string) => void;

  bgColor: string;
  setBgColor: (bgColor: string) => void;

  textColor: string;
  setTextColor: (textColor: string) => void;

  viewType: "scroll" | "static";
  setViewType: (viewType: "scroll" | "static") => void;

  scrollSpeed: number; // pixels per second
  setScrollSpeed: (scrollSpeed: number) => void;
};

export const useBigTextStore = create<BigTextStore>((set) => ({
  mode: "edit",
  setMode: (mode) => set({ mode }),

  text: "Edit me and click Display to see the result!",
  setText: (text) => set({ text }),

  bgColor: "#0f0f0f",
  setBgColor: (bgColor) => set({ bgColor }),

  textColor: "#f1f1f1",
  setTextColor: (textColor) => set({ textColor }),

  viewType: "scroll",
  setViewType: (viewType) => set({ viewType }),

  scrollSpeed: 200,
  setScrollSpeed: (scrollSpeed) => set({ scrollSpeed }),
}));

function saveState(state: BigTextStore) {
  const params = new URLSearchParams();

  params.set("text", state.text);
  params.set("bgColor", state.bgColor);
  params.set("textColor", state.textColor);
  params.set("viewType", state.viewType);
  params.set("scrollSpeed", state.scrollSpeed.toString());

  const queryString = params.toString();
  const url = `${window.location.pathname}?${queryString}`;
  window.history.replaceState(null, "", url);
  return `${window.location.origin}${url}`; // return full URL
}
useBigTextStore.subscribe((state) => {
  saveState(state);
});

export function loadState() {
  const params = new URLSearchParams(window.location.search);

  const text = params.get("text");
  const bgColor = params.get("bgColor");
  const textColor = params.get("textColor");
  const viewType = params.get("viewType") === "static" ? "static" : "scroll";
  const scrollSpeed = parseInt(params.get("scrollSpeed") || "200", 10) || 200;

  const state = useBigTextStore.getState();
  if (text) state.setText(text);
  if (bgColor) state.setBgColor(bgColor);
  if (textColor) state.setTextColor(textColor);
  if (viewType) state.setViewType(viewType);
  if (scrollSpeed) state.setScrollSpeed(scrollSpeed);
}
