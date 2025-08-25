import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // This is now the main security gate for the entire admin section.
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 flex-shrink-0">
        <AdminSidebar />
      </aside>
      <main className="flex-grow p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}