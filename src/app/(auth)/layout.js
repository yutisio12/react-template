export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/50 p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        {children}
      </div>
    </div>
  );
}
