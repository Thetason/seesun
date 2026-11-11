export type CoachVideo = {
  id: string;
  title: string;
  /** What the video teaches — lets writers match a video to a guide topic. */
  topics: readonly string[];
};

// The coach's own long-form lessons on youtube.com/@thetasonwillcreate.
// Guides may embed only these; the validator rejects any other ID.
export const COACH_VIDEOS: readonly CoachVideo[] = [
  { id: "Uc_RBUmjEYk", title: "한번 배우면 평생 써먹는 고음발성 성공 공식!", topics: ["고음", "깊은 발음", "목조임"] },
  { id: "ay2PAFw2XV4", title: "결국 고음이 나라면 이게 돼야해요. 이 방법으로 접근하는게 제일 빠릅니다.", topics: ["고음", "발성 기초"] },
  { id: "QUDXB9sv3gc", title: "목에 힘이 빠지면 고음은 자연스럽게 따라옵니다. 딱 이거 3가지만 기억하세요", topics: ["목에 힘 빼기", "고음", "목조임"] },
  { id: "bctOAnbXpik", title: "말하는 목소리가 낮아도 고음이 잘 날 수 있다", topics: ["음역대", "저음 목소리", "고음"] },
  { id: "SlkcWh53RoE", title: "이 사소한걸로 ! 이제 노래방에서 내 노래가 확 달라집니다", topics: ["노래방", "취미 노래"] },
  { id: "NnW_PLpp1_o", title: "노래방만 가면 마음졸였던 사람. 그게 저였습니다", topics: ["노래방", "긴장", "원장 경험"] },
  { id: "3gu6iu7eAd8", title: "노래 잘부르는법! 이 작은 차이로 노래 잘 부를 수 있는거였다고?", topics: ["노래 잘 부르는 법", "노래방"] },
  { id: "Pth4so-g-9Q", title: "제 조카가 보컬레슨을 받게 된다면 저는 제일 먼저 이걸 시킬겁니다.", topics: ["보컬레슨 시작", "기초 연습"] },
  { id: "om5dyk3osjI", title: "노래는 여러분이 생각하는것보다 훨씬 더 멘탈적입니다", topics: ["긴장", "멘탈", "무대"] },
  { id: "_rB5zXZcBsE", title: "탑티어 배우도 쓰는 목소리 자체가 좋아지는 방법. 노래 발표 연기 발성 전부 다 좋아집니다", topics: ["말하는 목소리", "목소리 좋아지는 법", "발표"] },
  { id: "3KsXZ8sggkM", title: "음색이 좋으려면 어떻게 해야 돼? 김민석 과 영케이처럼 되고싶어서 찾은 방법", topics: ["음색", "톤"] },
  { id: "ELg_nUxTno4", title: "김고은님처럼 노래하는 법 | 고음 없이도 분위기있고 매력있게 노래하는 법", topics: ["감정 표현", "분위기", "음색"] },
];

export function coachVideo(id: string): CoachVideo | undefined {
  return COACH_VIDEOS.find((v) => v.id === id);
}
