import type { CollectionEntry, DataEntryMap } from "astro:content";
import { slugifyAll } from "./slugify";
import getSortedEntries from "./getSortedEntries";

const getPostsByTag = (
  entries: CollectionEntry<keyof DataEntryMap>[],
  tag: string
) =>
  getSortedEntries(
    entries.filter(entry => slugifyAll(entry.data.tags).includes(tag))
  );

export default getPostsByTag;
