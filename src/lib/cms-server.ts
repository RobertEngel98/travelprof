import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { CMS_DEFAULTS, CMS_SECTION_IDS } from "./cms";
import type { CmsData, CmsSectionId } from "./cms";

/* ═══ Server function: Load CMS data with fallback to defaults ═══ */

export async function getCmsData(): Promise<CmsData> {
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("cms_sections")
      .select("id, data");

    if (error || !data) {
      return CMS_DEFAULTS;
    }

    const result: Record<string, unknown> = {};
    for (const key of CMS_SECTION_IDS) {
      result[key] = CMS_DEFAULTS[key];
    }

    for (const row of data) {
      const id = row.id as CmsSectionId;
      if (id in CMS_DEFAULTS) {
        const dbData = row.data as Record<string, unknown> | null;
        if (dbData && Object.keys(dbData).length > 0) {
          result[id] = { ...(result[id] as object), ...dbData };
        }
      }
    }

    return result as unknown as CmsData;
  } catch {
    return CMS_DEFAULTS;
  }
}
