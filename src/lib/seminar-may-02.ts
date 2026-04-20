export const MAY_02_SEMINAR_TYPE = "세타쓴 종합선물세트 보컬세미나 · 2026-05-02";
export const MAY_02_SEMINAR_TITLE = "세타쓴 종합선물세트 보컬세미나";
export const MAY_02_SEMINAR_DATE_LABEL = "5월 2일 토요일 오후 3시";
export const MAY_02_SEMINAR_DURATION_LABEL = "1시간 30분 ~ 2시간";
export const MAY_02_SEMINAR_EARLY_BIRD_LIMIT = 10;
export const MAY_02_SEMINAR_EARLY_BIRD_PRICE = 35000;
export const MAY_02_SEMINAR_REGULAR_PRICE = 50000;

export function formatWon(value: number) {
    return `${value.toLocaleString("ko-KR")}원`;
}

export function getMay02SeminarPricing(applicationCount: number) {
    const isEarlyBird = applicationCount < MAY_02_SEMINAR_EARLY_BIRD_LIMIT;
    const remainingEarlyBirdSpots = Math.max(0, MAY_02_SEMINAR_EARLY_BIRD_LIMIT - applicationCount);
    const price = isEarlyBird ? MAY_02_SEMINAR_EARLY_BIRD_PRICE : MAY_02_SEMINAR_REGULAR_PRICE;
    const priceLabel = isEarlyBird
        ? `선착순 ${MAY_02_SEMINAR_EARLY_BIRD_LIMIT}명 특별가 ${formatWon(MAY_02_SEMINAR_EARLY_BIRD_PRICE)}`
        : `현재 참가비 ${formatWon(MAY_02_SEMINAR_REGULAR_PRICE)}`;

    return {
        price,
        priceLabel,
        isEarlyBird,
        remainingEarlyBirdSpots,
    };
}
