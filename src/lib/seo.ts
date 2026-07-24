export const SITE_NAME = 'Card Compare';
export const SITE_TAGLINE = 'An analytical, independent read on credit card terms.';

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function pageTitle(title: string): string {
  return title === SITE_NAME ? title : `${title} · ${SITE_NAME}`;
}
