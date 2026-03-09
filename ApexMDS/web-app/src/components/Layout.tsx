import Sidebar from "./Sidebar";

export default function Layout({ children }: any) {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}