# LyricVerse - Song Lyrics Platform

LyricVerse is a full-stack web application built with Next.js and Firebase that allows users to browse, discover, and contribute song lyrics. It features a clean, minimalist user interface for a great reading experience and a secure, powerful admin dashboard for managing content.

![image](https://raw.githubusercontent.com/Manish-Tamang/lyrics-webapp/5fed5bd52bca4dc763bd92796f3df189d08fd982/public/homepage.png)

## ✨ Features

### User-Facing Site
- **Browse Songs & Artists**: Discover new music and artists through dedicated pages
- **Dynamic Song Pages**: View detailed song information including lyrics, artist, album, and artwork
- **View Counter**: See how popular a song is with a real-time view counter
- **Lyric Submission**: Contribute to the platform using a dedicated form to submit new song lyrics
- **Responsive Design**: A seamless experience across desktop and mobile devices
- **Custom Fonts**: Special fonts are used for Nepali lyrics to ensure proper rendering

### Admin Dashboard
- **Secure Authentication**: Admin access is protected via Google OAuth and managed through an ADMIN_EMAILS environment variable
- **Submission Management**: Admins can review pending lyric submissions, and either approve or reject them
- **Content Creation**: Approving a submission automatically creates a new song entry in the database
- **Data Overview**: View key statistics like total songs, artists, and pending submissions
- **User Management**: The system is designed to track contributors and admin actions

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage (for images)
- **Authentication**: NextAuth.js (with Google Provider)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui built on top of Radix UI
- **Forms**: React Hook Form with Zod for validation
- **Deployment**: Ready for Vercel deployment

## 📂 Project Structure

The project uses the Next.js App Router. The app directory is organized using route groups to separate concerns between the public-facing site and the admin dashboard.

```
.
├── app
│   ├── (admin)         # Admin-only routes and layout
│   │   ├── admin
│   │   └── login
│   ├── (site)          # Public-facing routes and layout
│   │   ├── about
│   │   ├── artists
│   │   ├── song
│   │   └── submit-lyrics
│   └── api             # API routes (NextAuth, views)
├── components
│   ├── admin           # Components exclusive to the admin dashboard
│   ├── ui              # Reusable UI components from shadcn/ui
│   └── ...             # Shared components (Navbar, Footer, Cards)
├── lib
│   ├── firebase        # Firebase configuration and services
│   ├── auth.ts         # NextAuth options and configuration
│   └── ...             # Utility functions and data fetching logic
├── public              # Static assets (images, fonts)
└── middleware.ts       # Protects admin routes by verifying authentication
```

- **app/(site)**: Contains all the pages for the public website. These routes share a common layout defined in `app/(site)/layout.tsx`
- **app/(admin)**: Contains all the pages for the admin dashboard. These routes have their own layout and are protected
- **middleware.ts**: Checks if a user is an authenticated admin before allowing access to any route under `/admin`

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of your project by copying the example file:

```bash
cp .env.example .env.local
```

Now, fill in the `.env.local` file with your credentials:

```env
# NextAuth
# Generate a secret: `openssl rand -base64 32`
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Google OAuth Credentials
# Get these from the Google Cloud Console
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Comma-separated list of Google emails that should have admin access
ADMIN_EMAILS=admin1@example.com,admin2@example.com

# Firebase Configuration
# Get these from your Firebase project settings
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

#### How to get the credentials:

- **Firebase**: Create a new project on Firebase. Go to Project Settings > General, and under "Your apps", create a new Web App to get your configuration object
- **Google OAuth**: Go to the Google Cloud Console. Create a new project, navigate to "APIs & Services" > "Credentials", and create new "OAuth 2.0 Client IDs" for a web application. Make sure to add `http://localhost:3000` to the "Authorized JavaScript origins" and `http://localhost:3000/api/auth/callback/google` to the "Authorized redirect URIs"

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The admin panel will be available at [http://localhost:3000/admin](http://localhost:3000/admin).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.