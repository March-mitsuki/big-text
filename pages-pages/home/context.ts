import { create } from "zustand";

export type BigTextStore = {
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

  staticViewFontSize: number;
  setStaticViewFontSize: (fontSize: number) => void;
};

export const useBigTextStore = create<BigTextStore>((set) => ({
  text: "Edit me and click Display to see the result!",
  setText: (text) => set({ text }),

  bgColor: "black",
  setBgColor: (bgColor) => set({ bgColor }),

  textColor: "white",
  setTextColor: (textColor) => set({ textColor }),

  viewType: "scroll",
  setViewType: (viewType) => set({ viewType }),

  scrollSpeed: 200,
  setScrollSpeed: (scrollSpeed) => set({ scrollSpeed }),

  staticViewFontSize: 100,
  setStaticViewFontSize: (fontSize) => set({ staticViewFontSize: fontSize }),
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
  const scrollSpeed = parseInt(params.get("scrollSpeed") || "200", 10);

  useBigTextStore.setState((state) => ({
    text: text || state.text,
    bgColor: bgColor || state.bgColor,
    textColor: textColor || state.textColor,
    viewType: viewType || state.viewType,
    scrollSpeed: scrollSpeed || state.scrollSpeed,
  }));
}
