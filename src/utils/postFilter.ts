import type { CollectionEntry, DataEntryMap } from "astro:content";
import { SITE } from "@/config";

const postFilter = ({ data }: CollectionEntry<keyof DataEntryMap>) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
