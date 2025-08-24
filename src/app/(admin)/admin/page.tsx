import { getServerSession } from "next-auth";

export default async function AdminDashboardPage() {
  // We can still get the session to personalize the page
  const session = await getServerSession();

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8">Admin Dashboard</h1>
      <p className="text-lg text-on-background">
        Welcome, {session?.user?.name}!
      </p>
      <p className="mt-4 text-on-background">
        This is your main dashboard. Select an option from the sidebar to get started.
      </p>
    </div>
  );
}