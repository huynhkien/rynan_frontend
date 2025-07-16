import { usePageTransition } from "@/shared/hooks/usePageTransition"
import Link from "next/link";
import { MouseEvent } from "react";

export const LinkTransition = ({href, children, name, style}: {href: string, children?: React.ReactNode, name?: string, style?: React.CSSProperties}) => {
    const {navigateWithLoading} = usePageTransition();
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigateWithLoading(href);
    };

  return (
    <Link href={href} onClick={handleClick} style={style}>
      {children}{name}
    </Link>
  );
};