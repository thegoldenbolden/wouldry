"use client";
import { Link, type LinkProps } from "~/components/ui/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

type Props = LinkProps &
  React.PropsWithChildren<{
    href: string;
    active?: string;
    inactive?: string;
    parent?: string;
  }>;

export function ActiveLink({
  className = "",
  active = "",
  inactive = "",
  parent,
  ...props
}: Props) {
  const pathname = usePathname();
  const isActive = pathname === props.href || parent === pathname;
  const style = cn(className, { [active]: isActive, [inactive]: !isActive });
  return (
    <Link data-active={isActive} className={style} {...props}>
      {props.children}
    </Link>
  );
}
