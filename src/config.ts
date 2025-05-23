export const SITE = {
  website: "https://github.com/choiOV", // replace this with your deployed domain
  author: "choiOV",
  profile: "url",
  desc: "",
  title: "choiOV.blog",
  ogImage: "",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "수정 제안하기",
    url: "https://github.com/choiOV",
  },
  dynamicOgImage: true,
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Tokyo", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
