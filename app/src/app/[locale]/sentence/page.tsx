import { redirect } from "@/i18n/routing";

export default function SentencePage() {
  redirect({ href: "/", locale: "ko" });
}
