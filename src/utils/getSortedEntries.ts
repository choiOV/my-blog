import type { CollectionEntry, DataEntryMap } from "astro:content";
import postFilter from "./postFilter";

const getSortedEntries = (entries: CollectionEntry<keyof DataEntryMap>[]) => {
  return entries
    .filter(postFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
};

export default getSortedEntries;
