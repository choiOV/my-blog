import { BLOG_PATH, PROJECTS_PATH, BOOKS_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
) {
  let baseRemovedPath = filePath;
  let basePath = "";

  switch (true) {
    case filePath?.includes(BLOG_PATH):
      baseRemovedPath = filePath?.replace(BLOG_PATH, "");
      basePath = includeBase ? "/posts" : "";
      break;

    case filePath?.includes(PROJECTS_PATH):
      baseRemovedPath = filePath?.replace(PROJECTS_PATH, "");
      basePath = includeBase ? "/projects" : "";
      break;

    case filePath?.includes(BOOKS_PATH):
      baseRemovedPath = filePath?.replace(BOOKS_PATH, "");
      basePath = includeBase ? "/books" : "";
      break;

    default:
      baseRemovedPath = filePath;
      basePath = includeBase ? "" : "";
  }

  const pathSegments = baseRemovedPath
    ?.split("/")
    .filter(p => p !== "")
    .filter(p => !p.startsWith("_"))
    .slice(0, -1)
    .map(slugifyStr);

  const slug = id.split("/").pop();

  if (!pathSegments || pathSegments.length < 1) {
    return [basePath, slug].join("/");
  }

  return [basePath, ...pathSegments, slug].join("/");
}
