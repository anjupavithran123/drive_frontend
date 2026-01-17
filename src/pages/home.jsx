import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* ---------- Navbar ---------- */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span className="text-2xl">☁️</span>
          <span>DriveBox</span>
        </div>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 transition shadow"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ---------- Hero Section ---------- */}
      <section className="flex flex-col items-center text-center px-6 py-24">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Secure Cloud Storage <br />
          <span className="text-red-500">Made Simple</span>
        </h1>

        <p className="mt-6 max-w-2xl text-gray-400 text-lg">
          Store, organize, share, and access your files from anywhere.
          DriveBox keeps your data safe, fast, and always available.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            to="/register"
            className="px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 transition shadow-lg"
          >
            Create Free Account
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-red-500/40 transition"
          >
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-white/10 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} DriveBox · Secure Cloud Storage
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "📁",
    title: "Smart File Management",
    desc: "Organize files and folders effortlessly with fast search and previews.",
  },
  {
    icon: "🔐",
    title: "Secure & Private",
    desc: "Your data is protected with modern authentication and permissions.",
  },
  {
    icon: "🔗",
    title: "Easy Sharing",
    desc: "Share files and folders with controlled access in seconds.",
  },
];
