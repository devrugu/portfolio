import { MetadataRoute } from 'next';
import { client } from '@/sanity/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.ugurcanyilmaz.com';

    // Fetch blog post slugs from Sanity
    const posts = await client.fetch<{ slug: string; publishedAt: string }[]>(
        `*[_type == "post"]{ "slug": slug.current, publishedAt }`
    );

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/now`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        // Project pages
        { url: `${baseUrl}/projects/sonar-system`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
        { url: `${baseUrl}/projects/fir-filter`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
        { url: `${baseUrl}/projects/digital-watermarking`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
        { url: `${baseUrl}/projects/healthcare-system`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
        { url: `${baseUrl}/projects/event-certificate`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
        { url: `${baseUrl}/projects/regex-engine`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
    ];

    // Dynamic blog post pages
    const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'yearly' as const,
        priority: 0.6,
    }));

    return [...staticPages, ...blogPages];
}