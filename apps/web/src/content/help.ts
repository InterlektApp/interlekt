/**
 * Help centre content.
 *
 * There is no help/CMS endpoint yet, so the articles live in the repo and
 * the page searches them in the browser. Every article describes behaviour
 * the product actually has today — nothing about payments, refunds,
 * certificates or payouts, because none of those exist yet.
 */

export interface HelpTopic {
  id: string;
  label: string;
  description: string;
}

export interface HelpArticle {
  slug: string;
  title: string;
  topic: string;
  summary: string;
  body: string[];
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "getting-started",
    label: "Getting started",
    description: "Find a community, understand what it contains, and join it.",
  },
  {
    id: "learning",
    label: "Learning & classroom",
    description: "Work through courses and modules and track your progress.",
  },
  {
    id: "community-feed",
    label: "Community feed",
    description: "Ask questions and read what other members are working on.",
  },
  {
    id: "creator-studio",
    label: "Creator Studio",
    description: "Publish a community, build a curriculum and manage members.",
  },
  {
    id: "account",
    label: "Account & security",
    description: "Your profile, your password and who can see what you do.",
  },
];

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "how-to-join-a-community",
    title: "How to join a community",
    topic: "getting-started",
    summary: "Open a community, read what is inside it, and join in a couple of clicks.",
    body: [
      "Every community page shows the cover image, the description, the creator behind it, how many members have joined and what the community costs. If the community is free it says Free; if it is paid it shows the price in naira.",
      "To join, open the community and choose Enroll now. If you are not signed in yet you will be asked to sign in first and you will come straight back to the community page afterwards.",
      "Free communities open immediately. Paid communities can be listed and browsed, but completing a paid enrolment needs the payment service, which is not live yet — the creator is notified of your interest in the meantime.",
    ],
  },
  {
    slug: "what-happens-after-you-join",
    title: "What happens after you join",
    topic: "getting-started",
    summary: "Your classroom, your feed and your dashboard are all one click away.",
    body: [
      "Once you are a member, the community page grows a classroom link and a discussion link. The classroom is where the courses live; the discussion is the community feed.",
      "Your dashboard lists every community you belong to, along with the courses inside each one and how far through them you are.",
      "You can leave a community at any time from your communities list. Leaving removes the community from your dashboard; it does not delete your account or your profile.",
    ],
  },
  {
    slug: "using-the-classroom",
    title: "Using the classroom",
    topic: "learning",
    summary: "Courses, modules and lessons — how the curriculum is structured.",
    body: [
      "A community contains one or more courses. Each course contains modules, and each module contains lessons. A lesson is either a text lesson or a video lesson, and carries its own length.",
      "Open a course from the classroom to see the module list. Expand a module to see the lessons inside it and how long each one takes.",
      "Lessons unlock in order. Work through a module, mark the lessons complete, and your progress is saved against your account as you go.",
    ],
  },
  {
    slug: "tracking-your-progress",
    title: "Tracking your lesson progress",
    topic: "learning",
    summary: "Your progress is stored on your account, so it follows you between devices.",
    body: [
      "Marking a lesson complete records it against your account on the server. That means your progress is the same whether you switch browser, switch laptop, or sign in on someone else's device.",
      "Course progress shows how many lessons you have completed out of how many the course contains, plus a completion percentage. Your dashboard rolls that up across every community you belong to.",
      "Progress is never shared with other members, and creators see aggregate completion for their community rather than individual lesson history.",
    ],
  },
  {
    slug: "using-the-community-feed",
    title: "Using the community feed",
    topic: "community-feed",
    summary: "Ask a question, answer one, and keep the conversation on topic.",
    body: [
      "The feed is the conversation inside a community. Members post questions, share what they are building, and answer each other. Creators can pin a post or mark it as an announcement.",
      "Each post shows its author, how long ago it was posted, and how many replies it has.",
      "The feed is open to members of that community only. If you cannot see it yet, join the community first.",
    ],
  },
  {
    slug: "creating-your-first-community",
    title: "Creating your first community in Creator Studio",
    topic: "creator-studio",
    summary: "Set a title, a description, a price and a cover — then publish.",
    body: [
      "Creator Studio is where you manage the communities you own. A new community needs a title, a description, at least one category, and a price.",
      "The price you set is what learners see on the community card and on the community page. Free communities are joined instantly. Paid communities are listed with their price and can be enrolled in once the payment service is live.",
      "A community stays hidden from the public directory until you publish it. Publishing is what puts it in Explore and in search results.",
    ],
  },
  {
    slug: "adding-modules-and-lessons",
    title: "Adding modules and lessons to a course",
    topic: "creator-studio",
    summary: "Build the curriculum in the order you want learners to work through it.",
    body: [
      "A course is a container for modules, and a module is a container for lessons. Give each one a clear title — the module title is what learners see when they expand it.",
      "Lessons are text or video. Text lessons carry a body; video lessons carry a video URL. Every lesson can carry its own length in seconds, which is shown next to its title.",
      "Modules and lessons can be published independently. Unpublished ones stay invisible to learners while you keep working on them.",
    ],
  },
  {
    slug: "getting-your-creator-account-verified",
    title: "Getting your creator account verified",
    topic: "creator-studio",
    summary: "What the verification badge means and how to get it.",
    body: [
      "Every creator on Interlekt has a verification status: pending, verified or rejected. While a creator is pending, their profile shows a verification-pending badge.",
      "Once a creator is verified, their profile and every community they publish carry the teal verification check. It tells learners that a person has reviewed the creator's identity and work history.",
      "Verification is reviewed by the Interlekt team. If your profile is missing a bio or a list of expertise, add those first — they are what the review looks at.",
    ],
  },
  {
    slug: "resetting-your-password",
    title: "Resetting your password",
    topic: "account",
    summary: "Request a reset link, then choose a new password.",
    body: [
      "Open Forgot password on the sign-in page and enter the email address on your account. If an account exists for that address, a reset link is on its way.",
      "Open the link on the same device you requested it from and choose a new password. The reset link is single use.",
      "If the link has expired or has already been used, request a new one. You can request another link from the confirmation screen.",
    ],
  },
  {
    slug: "signing-out-and-session-security",
    title: "Signing out and keeping your session secure",
    topic: "account",
    summary: "What is stored on your device, and how to end a session.",
    body: [
      "When you sign in, Interlekt stores your access and refresh tokens in your browser's local storage. Nothing is stored in a cookie, and no third-party analytics or advertising scripts run on Interlekt.",
      "Tick Keep me signed in on this device to stay signed in across browser restarts. Leave it unticked and your session ends when you close the tab.",
      "You can end a session at any time from the sign-out page. Signing out clears the tokens from your browser and revokes the refresh token on the server.",
    ],
  },
];

export function findHelpArticle(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((article) => article.slug === slug);
}

export function findHelpTopic(id: string): HelpTopic | undefined {
  return HELP_TOPICS.find((topic) => topic.id === id);
}
