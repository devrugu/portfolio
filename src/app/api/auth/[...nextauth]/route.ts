import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is where you would typically look up the user in a database.
        // For our simple case, we're comparing against environment variables.
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          // Any object returned here will be saved in the session.
          return { id: "1", name: "Admin" };
        } else {
          // If you return null, an error will be displayed to the user.
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // Redirect users to our custom login page
  },
});

export { handler as GET, handler as POST };