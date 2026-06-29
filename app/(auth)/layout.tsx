export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg lg:w-250 sm:w-100 w-full lg:p-0 p-10 sm:mx-0 mx-5">
        {children}
      </div>
    </main>
  );
}
