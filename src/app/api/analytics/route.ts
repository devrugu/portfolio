import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';

// Initialize the Analytics Data Client
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    // Decode the Base64 private key back to its original format
    private_key: Buffer.from(process.env.GCP_PRIVATE_KEY_BASE64!, 'base64').toString('utf8'),
  },
});

const propertyId = process.env.GA_PROPERTY_ID!;

/**
 * @description POST /api/analytics - Fetches a specific report from Google Analytics.
 */
export async function POST(request: Request) {
  // 1. Authenticate the user (ensure they are the logged-in admin)
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // 2. Get the requested report type from the request body
  const { reportName } = await request.json();

  if (!reportName) {
    return NextResponse.json({ message: 'Report name is required.' }, { status: 400 });
  }

  try {
    let response;
    // 3. Use a switch statement to handle different report requests
    switch (reportName) {
      case 'visitorsByCountry':
        response = await getVisitorsByCountry();
        break;
      case 'pageViews':
        response = await getPageViews();
        break;
      case 'linkClicks':
        response = await getLinkClicks();
        break;
      default:
        return NextResponse.json({ message: 'Invalid report name.' }, { status: 400 });
    }
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);
    return NextResponse.json({ message: 'Failed to fetch analytics data.' }, { status: 500 });
  }
}

// --- REPORT FETCHING FUNCTIONS ---

// Fetches the number of active users per country in the last 30 days
async function getVisitorsByCountry() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'activeUsers' }],
  });

  const data = response.rows?.map(row => ({
    country: row.dimensionValues?.[0].value,
    users: row.metricValues?.[0].value,
  })) || [];

  return data;
}

// Fetches the number of views for the top 5 pages in the last 30 days
async function getPageViews() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    limit: 5,
  });

  const data = response.rows?.map(row => ({
    page: row.dimensionValues?.[0].value,
    views: row.metricValues?.[0].value,
  })) || [];

  return data;
}

// Fetches the click counts for our custom "Social Links" events
async function getLinkClicks() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'eventLabel' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventCategory',
        stringFilter: { value: 'Social Links' }
      }
    },
  });

  const data = response.rows?.map(row => ({
    link: row.dimensionValues?.[0].value,
    clicks: row.metricValues?.[0].value,
  })) || [];

  return data;
}