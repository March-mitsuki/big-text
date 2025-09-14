import { usePageContext } from "vike-react/usePageContext";

export type LinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};
export function Link({ href, className, children }: LinkProps) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const isActive = href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  return (
    <a href={href} className={isActive ? "is-active" + " " + className || "" : className || ""}>
      {children}
    </a>
  );
}
