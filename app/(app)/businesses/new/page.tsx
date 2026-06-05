import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Business",
};

/** Create new business page scaffold. */
export default function NewBusinessPage() {
  return (
    <div id="new-business-page">
      <h1>Create Business</h1>
    </div>
  );
}
