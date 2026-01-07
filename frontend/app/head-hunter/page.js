import Navbar from '../../components/Navbar';

export default function HeadHunterPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">Head Hunter</h1>
          <div className="bg-dark-card border border-dark-border rounded-lg p-8">
            <p className="text-dark-text-muted mb-4">
              Connect with top recruiters and headhunters to find your next opportunity.
            </p>
            <p className="text-dark-text-muted">
              This feature is coming soon. Check back later for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
