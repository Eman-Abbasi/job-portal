import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-dark-text-muted mb-8">
            Discover thousands of job opportunities from top companies around the world
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/jobs"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              href="/signup"
              className="bg-dark-surface hover:bg-dark-card text-white px-8 py-3 rounded-lg font-semibold border border-dark-border transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <h3 className="text-xl font-semibold mb-3">Search Jobs</h3>
            <p className="text-dark-text-muted">
              Find jobs by keywords, location, category, and experience level
            </p>
          </div>
          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <h3 className="text-xl font-semibold mb-3">Track Applications</h3>
            <p className="text-dark-text-muted">
              Keep track of all your job applications in one place
            </p>
          </div>
          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <h3 className="text-xl font-semibold mb-3">Manage Resume</h3>
            <p className="text-dark-text-muted">
              Upload and manage your resumes easily
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
