import Link from "next/link";
import { docPath, guidesForService } from "@/lib/content/registry";

type Styles = Record<string, string>;

// Lists guides that belong to a service page, so the page is linked to its
// supporting content and search engines see the topic cluster.
export function RelatedGuides({ servicePath, styles }: { servicePath: string; styles: Styles }) {
  const guides = guidesForService(servicePath);
  if (!guides.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>더 읽어보기 — 발성 가이드</h2>
      <ul className={styles.checklist}>
        {guides.map((doc) => (
          <li key={doc.slug}>
            <Link className={styles.inlineLink} href={docPath(doc)}>
              {doc.title}
            </Link>
          </li>
        ))}
        <li>
          <Link className={styles.inlineLink} href="/guide">
            발성 가이드 전체 보기
          </Link>
        </li>
      </ul>
    </section>
  );
}
