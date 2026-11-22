export interface SiteMeta {
  title: string;
  description: string;
  author: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
}

export function siteMeta(content: unknown): SiteMeta;
export function applySiteMeta(html: string, content: unknown): string;
