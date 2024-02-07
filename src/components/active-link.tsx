"use client";
import { usePathname } from "next/navigation";
import { Link, type LinkProps } from "~/components/ui/link";
import { cn } from "~/lib/utils";

type Props = Omit<LinkProps, "className"> & {
  rootPath?: string;
  className: {
    default?: string;
    active?: string;
    inactive?: string;
  };
};

export function ActiveLink({
  rootPath = "",
  className = {
    default: "",
    active: "",
    inactive: "",
  },
  ...props
}: Props) {
  const pathname = usePathname();
  const active = pathname === props.href || rootPath === pathname;

  return (
    <Link
      data-active={active}
      className={cn(
        "group",
        className.default,
        active ? className.active : className.inactive,
      )}
      {...props}
    />
  );
}
