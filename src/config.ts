export const SITE = {
  website: "https://www.choiov-blog.site/", // replace this with your deployed domain
  author: "choiOV",
  profile: "https://github.com/choiOV",
  desc: "choiOV의 기술 블로그입니다.",
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
    url: "https://github.com/choiOV/my-blog/tree/master/",
  },
  dynamicOgImage: true,
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Tokyo", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
