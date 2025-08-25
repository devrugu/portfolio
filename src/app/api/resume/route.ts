import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ResumeModel from "@/models/Resume";

export const dynamic = 'force-dynamic';

// A utility function to get the user's ID from the session
async function getUserId() {
  const session = await getServerSession();

  // For a single-user site, we don't need a complex ID from the session.
  // We just need to confirm that a session EXISTS.
  if (!session || !session.user) {
    // This will be caught by our try/catch blocks and return a 401 Unauthorized
    throw new Error("User not authenticated");
  }

  // Return a consistent, unique ID for the admin user.
  return "admin_user_01";
}

// Default data for a new resume
const defaultResumeData = {
  personalInfo: {
    name: "Your Name",
    email: "your.email@example.com",
    phone: "555-555-5555",
    website: "your-portfolio.com",
    location: "City, State",
    summary: "A passionate and driven professional with experience in...",
  },
  experience: [],
  education: [],
  skills: [],
};

/**
 * @description GET /api/resume - Fetches the user's resume.
 * If a resume doesn't exist, it creates a new one with default data.
 */
export async function GET() {
  try {
    await dbConnect();
    const userId = await getUserId();

    let resume = await ResumeModel.findOne({ userId });

    // If no resume is found, create one with default data
    if (!resume) {
      resume = await ResumeModel.create({
        userId,
        ...defaultResumeData,
      });
    }

    return NextResponse.json(resume, { status: 200 });
  } catch (error: any) { // Add ': any' to type the error object
    console.error("GET /api/resume error:", error);

    // Check for our specific authentication error
    if (error.message === "User not authenticated") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "An error occurred fetching the resume." },
      { status: 500 }
    );
  }
}

/**
 * @description PUT /api/resume - Updates the user's resume.
 */
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const userId = await getUserId();
    const body = await request.json(); // Get the updated resume data from the request body

    // Find the user's resume and update it with the new data.
    // The { new: true } option tells Mongoose to return the updated document.
    const updatedResume = await ResumeModel.findOneAndUpdate(
      { userId },
      body,
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return NextResponse.json({ message: "Resume not found." }, { status: 404 });
    }

    return NextResponse.json(updatedResume, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/resume error:", error);

    if (error.message === "User not authenticated") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "An error occurred updating the resume." },
      { status: 500 }
    );
  }
}

