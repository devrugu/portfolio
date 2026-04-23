import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: Buffer.from(process.env.GCP_PRIVATE_KEY_BASE64!, 'base64')
      .toString('utf8')
      .replace(/\\n/g, '\n'),  // fix escaped newlines
  },
});

const propertyId = process.env.GA_PROPERTY_ID!;

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      overviewData,
      pageViewsData,
      countryData,
      dailyData,
      deviceData,
      referrerData,
    ] = await Promise.all([
      // Overview: total users, sessions, pageviews, avg session duration last 30 days
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
      }),

      // Top pages by views
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 8,
      }),

      // Visitors by country
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 8,
      }),

      // Daily visitors last 14 days
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '13daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),

      // Device category breakdown
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
      }),

      // Top referrers
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 6,
      }),
    ]);

    // Parse overview
    const overviewRow = overviewData[0].rows?.[0];
    const overview = {
      users:           parseInt(overviewRow?.metricValues?.[0]?.value || '0'),
      sessions:        parseInt(overviewRow?.metricValues?.[1]?.value || '0'),
      pageViews:       parseInt(overviewRow?.metricValues?.[2]?.value || '0'),
      avgSessionDuration: parseFloat(overviewRow?.metricValues?.[3]?.value || '0'),
      bounceRate:      parseFloat(overviewRow?.metricValues?.[4]?.value || '0'),
    };

    // Parse top pages
    const topPages = pageViewsData[0].rows?.map(row => ({
      path:  row.dimensionValues?.[0]?.value || '',
      title: row.dimensionValues?.[1]?.value || '',
      views: parseInt(row.metricValues?.[0]?.value || '0'),
    })) || [];

    // Parse countries
    const countries = countryData[0].rows?.map(row => ({
      country: row.dimensionValues?.[0]?.value || '',
      users:   parseInt(row.metricValues?.[0]?.value || '0'),
    })) || [];

    // Parse daily data
    const daily = dailyData[0].rows?.map(row => {
      const d = row.dimensionValues?.[0]?.value || '';
      return {
        date:      `${d.slice(4, 6)}/${d.slice(6, 8)}`,
        users:     parseInt(row.metricValues?.[0]?.value || '0'),
        pageViews: parseInt(row.metricValues?.[1]?.value || '0'),
      };
    }) || [];

    // Parse devices
    const devices = deviceData[0].rows?.map(row => ({
      device: row.dimensionValues?.[0]?.value || '',
      users:  parseInt(row.metricValues?.[0]?.value || '0'),
    })) || [];

    // Parse referrers
    const referrers = referrerData[0].rows?.map(row => ({
      source:   row.dimensionValues?.[0]?.value || '',
      sessions: parseInt(row.metricValues?.[0]?.value || '0'),
    })) || [];

    return NextResponse.json({
      overview, topPages, countries, daily, devices, referrers,
    });

  } catch (error: any) {
    console.error('Analytics API error:', error?.message);
    return NextResponse.json(
      { message: error?.message || 'Failed to fetch analytics data.' },
      { status: 500 }
    );
  }
}