import { useEffect, useRef } from "react";
import { usePageContext } from "vike-react/usePageContext";

export type LinkProps = {
  href: string;
  className?: string;
  appendCurrentSearch?: boolean;
  children: React.ReactNode;
};
export function Link({ href, className, children, appendCurrentSearch }: LinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const isActive = href === "/" ? urlPathname === href : urlPathname.startsWith(href);

  useEffect(() => {
    if (!ref.current) return;
    if (appendCurrentSearch) {
      const el = ref.current;
      el.href = el.href + window.location.search; // 保留查询参数
    }
  }, []);

  return (
    <a ref={ref} href={href} className={isActive ? "is-active" + " " + className || "" : className || ""}>
      {children}
    </a>
  );
}
