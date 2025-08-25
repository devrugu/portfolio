export default function AnalyticsPage() {
  // You can construct the direct link to your GA Realtime report.
  // This part is a bit tricky as the URL can change, but a link to the main GA page is always safe.
  const gaDashboardUrl = "https://analytics.google.com/";

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8">Website Analytics</h1>
      <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50">
        <h2 className="text-2xl font-semibold text-accent mb-4">Live Data</h2>
        <p className="text-on-background mb-6">
          Visitor statistics (daily, weekly, monthly), page views, and geographic data are all being collected by Google Analytics.
          <br />
          Please note that data will only appear here after the site has been deployed and has received visitors. No data will be shown for `localhost` traffic.
        </p>
        <a
          href={gaDashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-accent text-on-primary font-bold py-3 px-6 rounded-lg hover:bg-accent-hover transition-colors text-lg"
        >
          View Full Analytics Dashboard
        </a>
        <p className="text-gray-400 text-sm mt-4">
          You will need to be logged into the Google account associated with your Analytics property to view the dashboard.
        </p>
      </div>
    </div>
  );
}