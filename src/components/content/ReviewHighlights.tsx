import Link from "next/link";
import { reviewsForService } from "@/lib/content/reviews";

type Styles = Record<string, string>;

export function ReviewHighlights({ servicePath, styles }: { servicePath: string; styles: Styles }) {
  const reviews = reviewsForService(servicePath);
  if (reviews.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>수강생 후기</h2>
      <div style={{ display: "grid", gap: 16, maxWidth: 760 }}>
        {reviews.map((review) => (
          <article key={`${review.author}-${review.date}`} className={styles.card}>
            <span className={styles.cardLabel}>{review.topic}</span>
            <p className={styles.cardDesc} style={{ whiteSpace: "pre-line" }}>
              {review.body}
            </p>
            <p className={styles.cardDesc} style={{ marginTop: 16, opacity: 0.6 }}>
              {review.author} · {review.date}
            </p>
          </article>
        ))}
      </div>
      <p className={styles.sectionBody} style={{ marginTop: 24 }}>
        <Link className={styles.inlineLink} href="/reviews">
          수강생 후기 전체 보기
        </Link>
      </p>
    </section>
  );
}
