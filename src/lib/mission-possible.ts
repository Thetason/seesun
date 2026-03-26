const MISSION_POSSIBLE_TRACK_IDS = ["track_spark", "track_signature", "track-signature", "track_reserve"] as const;

const missionPossibleTrackIdSet = new Set<string>(MISSION_POSSIBLE_TRACK_IDS);

export function isMissionPossibleTrackId(trackId: string | null | undefined) {
    return Boolean(trackId && missionPossibleTrackIdSet.has(trackId));
}

export { MISSION_POSSIBLE_TRACK_IDS };
