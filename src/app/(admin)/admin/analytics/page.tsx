export default function AnalyticsPage() {
  // Direct link to the main Google Analytics dashboard.
  const gaDashboardUrl = "https://analytics.google.com/";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-primary">Website Analytics</h1>
        {/* --- NEW: Direct link to Google Analytics --- */}
        <a
          href={gaDashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-accent text-on-primary font-bold py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors"
        >
          View Full Report in GA
        </a>
      </div>

      <p className="text-on-background mb-6">
        This is a live overview of your website's key metrics, powered by Google Looker Studio. For a more detailed analysis, use the button above.
      </p>
      
      {/* Embedded Looker Studio Dashboard */}
      <div className="w-full h-[75vh] bg-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src="https://lookerstudio.google.com/embed/reporting/24ac1e0c-3ac5-47b6-948d-056dd78ebaa8/page/BARWF" // Paste the same Looker Studio SRC URL
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
      </div>
    </div>
  );
}