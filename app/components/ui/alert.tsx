export function Alert({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="rounded-lg border border-yellow-400 bg-yellow-100 p-4 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-200" {...props}>
      {children}
    </div>
  );
}

export function AlertTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-bold">{children}</h3>;
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-sm">{children}</p>;
}
