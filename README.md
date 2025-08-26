# Personal Resume & Blog Website

This repository contains the source code for my personal portfolio, resume, and blog website, built from the ground up with a modern, full-stack technology set. The project is designed to be a comprehensive showcase of my skills in web development, from frontend design to backend APIs and database management.

**Live Site:** [ugurcanyilmaz.com](https://portfolio-devrugus-projects.vercel.app/)  <!-- Replace with your actual domain when it's live -->

![Homepage Screenshot](./public/screenshot-homepage.png) <!-- We will add this screenshot in the next step -->

---

## Core Features

This project is more than just a static site; it's a complete content management platform with a public-facing site and a private admin panel.

#### **Public-Facing Site:**
*   **Dynamic Homepage:** A modern, animated homepage featuring an introduction, a live age counter, and a showcase of key projects.
*   **Data-Driven Resume:** A professional resume page that pulls all its data from a MongoDB database, with a "Download as PDF" feature.
*   **Headless Blog:** A fully functional blog that fetches and renders posts from the Sanity.io headless CMS.
*   **Responsive Design:** The entire site is fully responsive, designed to look great on desktop, tablets, and mobile devices.
*   **Polished Animations:** Subtle and professional animations using Framer Motion to enhance the user experience.

#### **Private Admin Panel:**
*   **Secure Authentication:** A private `/admin` route protected by a username/password login system using NextAuth.js.
*   **Dynamic Resume Editor:** A complete CRUD interface for managing all sections of the resume (personal info, experience, education, skills). Changes are saved directly to the database.
*   **Blog Management:** A dashboard that lists all blog posts and provides deep links to create new posts or edit existing ones directly in the embedded Sanity Studio.
*   **Analytics Dashboard:** A page that links directly to a Google Analytics dashboard to track site performance and visitor engagement.

---

## Technical Stack

This project utilizes a modern JAMstack architecture, prioritizing performance, security, and developer experience.

*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **Backend Logic:** Next.js API Routes (Serverless Functions)
*   **Database:** MongoDB Atlas
*   **Headless CMS (for Blog):** Sanity.io
*   **Authentication:** NextAuth.js
*   **PDF Generation:** `jspdf` & `html2canvas`
*   **Deployment:** Vercel

---

## Running the Project Locally

To run this project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/devrugu/portfolio.git
    cd personal-website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add the following variables. These are required for the application to connect to the necessary services.
    ```env
    # Sanity
    NEXT_PUBLIC_SANITY_PROJECT_ID="YOUR_PROJECT_ID"
    NEXT_PUBLIC_SANITY_DATASET="production"

    # Auth
    AUTH_SECRET="GENERATE_A_SECRET_KEY" # Use `openssl rand -base64 32`
    ADMIN_USERNAME="your_admin_username"
    ADMIN_PASSWORD="your_admin_password"

    # Database
    MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING"

    # Analytics
    NEXT_PUBLIC_GA_MEASUREMENT_ID="YOUR_GA_ID"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`. The embedded Sanity Studio will be at `http://localhost:3000/studio`.