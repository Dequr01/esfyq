/**
 * SCREENSHOT STATUS (as of last content update):
 * - Synaptix:          ⚠️  PENDING — supply a real app screenshot (blurred/obscured OK for confidentiality)
 * - Veloxia:           ⚠️  PENDING — supply a real dashboard/UI screenshot
 * - Custom Kernel:     ⚠️  PENDING — supply a terminal/build-log or boot-screen capture
 * - Crickit:           ⚠️  PENDING — supply a real in-app screenshot from either store
 *
 * Until real screenshots land, each project uses a brand-color placeholder defined inline
 * via `imagePlaceholder` so the card template never renders a deceptive stock photo.
 */

export const projects = [
  {
    id: "01",
    title: "Synaptix",
    category: "Healthcare Tech",
    description:
      "A healthcare tablet application built for real clinical use, designed with a calm, accessible interface for patient vitals monitoring and care workflows on Android tablets.",
    tags: ["React Native", "Redux", "Android"],
    // ⚠️ Screenshot pending — confidential client project; supply real capture before launch
    image: null,
    imagePlaceholder: { color: "#0d1f2d", label: "Screenshot pending" },
    liveUrl: null,
    githubUrl: null,
    year: "2024",
    caseStudy: "Case study coming soon. This is a confidential client project — detailed write-up will be published once cleared.",
    linkStatus: "confidential", // Instructs card UI to show "Case study coming soon" instead of broken links
  },
  {
    id: "02",
    title: "Veloxia",
    category: "AI Voice SaaS",
    description:
      "An AI voice agent platform where businesses deploy a voice assistant to handle calls, book appointments, and manage leads automatically — built on Next.js with a full post-call automation pipeline (webhook processing, CRM contact sync, booking linkage).",
    tags: ["Next.js", "Vapi AI", "Supabase", "Stripe", "Clerk"],
    // ⚠️ Screenshot pending — supply a real dashboard/UI capture
    image: null,
    imagePlaceholder: { color: "#0f1923", label: "Screenshot pending" },
    liveUrl: "https://voca-sooty.vercel.app",
    githubUrl: null,
    year: "2024",
    caseStudy: "Detailed write-up coming soon... This will contain the full architectural breakdown of the Veloxia platform.",
    linkStatus: "live",
  },
  {
    id: "03",
    title: "Custom Android Kernel (OnePlus 8 Pro)",
    category: "Systems Engineering",
    description:
      "A hardened custom Android kernel built from the ground up — SukiSU Ultra root solution integration, SUSFS (root/mount hiding) wiring, and low-level BPF/LSM security fixes, packaged and shipped through a self-maintained GitHub repository.",
    tags: ["C", "Linux Kernel", "Android", "Git"],
    // ⚠️ Screenshot pending — supply a terminal/build-log or boot-screen capture (no live app)
    image: null,
    imagePlaceholder: { color: "#0b1a0b", label: "Screenshot pending" },
    liveUrl: null,
    githubUrl: "https://github.com/Dequr01/op8pro",
    year: "2024",
    caseStudy: "Detailed write-up coming soon... This will contain the full breakdown of the kernel build, root integration, and security hardening approach.",
    linkStatus: "source-only",
  },
  {
    id: "04",
    title: "Crickit",
    category: "Mobile App",
    description:
      "A live club cricket platform with real-time score tracking, push notifications, and social sign-in, built and shipped to both app stores.",
    tags: ["React Native", "Expo", "Socket.IO", "Firebase"],
    // ⚠️ Screenshot pending — supply a real in-app screenshot from either store
    image: null,
    imagePlaceholder: { color: "#1a0f00", label: "Screenshot pending" },
    liveUrl: null,   // ⚠️ Supply actual App Store / Play Store URL when available
    githubUrl: null,
    year: "2023",
    caseStudy: "Detailed write-up coming soon... This will contain the full architectural breakdown of the Crickit real-time scoring and notification system.",
    linkStatus: "coming-soon",
  },
]
