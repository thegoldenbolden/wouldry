type Props = React.ComponentProps<"p">;

export function NoResults({ className, children, ...props }: Props) {
  return (
    <p className="text-center text-xl font-bold tracking-wide" {...props}>
      {children}
    </p>
  );
}
