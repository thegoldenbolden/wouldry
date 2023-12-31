export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-svh grid place-items-center py-16 px-3">
      {children}
    </div>
  );
}
