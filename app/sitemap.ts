import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{return ['','/privacy'].map(path=>({url:`${process.env.SITE_URL||'http://localhost:3000'}${path}`,lastModified:new Date('2026-09-25')}))}
