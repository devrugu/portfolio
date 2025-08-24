import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton"; // <-- IMPORT the component

export default async function AdminPage() {
  const session = await getServerSession();

  // If there is no session, redirect the user to the login page
  if (!session) {
    redirect("/login");
  }

  // If there is a session, display the protected content
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8">Admin Dashboard</h1>
      <p className="text-lg text-on-background mb-4">
        Welcome, {session.user?.name}! You are now logged in.
      </p>
      <p className="text-on-background mb-8">
        This is a protected area. Here you will manage your resume and view analytics.
      </p>
      {/* Use the imported component */}
      <SignOutButton />
    </div>
  );
}