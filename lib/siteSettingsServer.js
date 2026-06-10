import { prisma } from '@/lib/prisma';
import {
  DEFAULT_SITE_MEDIA,
  mergeSiteMedia,
  SITE_MEDIA_KEY,
} from '@/lib/siteSettingsDefaults';

export async function getSiteMedia() {
  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key: SITE_MEDIA_KEY },
    });
    if (!row?.value) return { ...DEFAULT_SITE_MEDIA };
    const parsed = JSON.parse(row.value);
    return mergeSiteMedia(parsed);
  } catch (error) {
    console.error('getSiteMedia', error);
    return { ...DEFAULT_SITE_MEDIA };
  }
}

export async function upsertSiteMedia(settings) {
  const merged = mergeSiteMedia(settings);
  await prisma.siteSetting.upsert({
    where: { key: SITE_MEDIA_KEY },
    create: { key: SITE_MEDIA_KEY, value: JSON.stringify(merged) },
    update: { value: JSON.stringify(merged) },
  });
  return merged;
}
