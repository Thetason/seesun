import Link from "next/link";
import type { ContentTable, ContentTestimonial } from "@/lib/content/types";
import { coachVideo } from "@/lib/content/videos";
import styles from "@/styles/keyword-landing.module.css";

export function SectionTable({ table }: { table: ContentTable }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {table.head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={i}>{cell}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SectionVideo({ id }: { id: string }) {
  const video = coachVideo(id);
  if (!video) return null;
  return (
    <figure className={styles.video}>
      <div className={styles.videoFrame}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}`}
          title={video.title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <figcaption className={styles.videoCaption}>
        세타쓴 유튜브 — {video.title}
      </figcaption>
    </figure>
  );
}

export function SectionTestimonial({ testimonial }: { testimonial: ContentTestimonial }) {
  return (
    <figure className={styles.testimonial}>
      <blockquote>“{testimonial.excerpt}”</blockquote>
      <figcaption>
        {testimonial.author} 님의 수강 후기 ·{" "}
        <Link className={styles.inlineLink} href="/reviews">
          후기 전문 보기
        </Link>
      </figcaption>
    </figure>
  );
}
