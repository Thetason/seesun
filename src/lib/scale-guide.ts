export type ScaleGuidePattern = {
    version: 1;
    label: string;
    description: string;
    rootNotes: string[];
    intervals: number[];
    noteNames: string[];
    noteDurationMs: number;
    gapMs: number;
};

export type ScaleGuidePreset = {
    key: string;
    label: string;
    description: string;
    pattern: ScaleGuidePattern;
};

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
const NOTE_TO_INDEX: Record<string, number> = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    Fb: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
    Cb: 11,
};

export const DEFAULT_SCALE_GUIDE_PRESET_KEY = "a2-to-a3-major-five";

function noteToMidi(note: string) {
    const match = note.trim().match(/^([A-G](?:#|b)?)(-?\d)$/);

    if (!match) {
        throw new Error(`Invalid note name: ${note}`);
    }

    const [, pitchClass, octaveText] = match;
    const noteIndex = NOTE_TO_INDEX[pitchClass];

    if (noteIndex === undefined) {
        throw new Error(`Unsupported pitch class: ${pitchClass}`);
    }

    const octave = Number(octaveText);
    return (octave + 1) * 12 + noteIndex;
}

function midiToNote(midi: number) {
    const noteIndex = ((midi % 12) + 12) % 12;
    const octave = Math.floor(midi / 12) - 1;
    return `${NOTE_NAMES[noteIndex]}${octave}`;
}

function transposeNote(note: string, semitoneOffset: number) {
    return midiToNote(noteToMidi(note) + semitoneOffset);
}

function buildNoteSequence(rootNotes: string[], intervals: number[]) {
    return rootNotes.flatMap((rootNote) => intervals.map((interval) => transposeNote(rootNote, interval)));
}

export const SCALE_GUIDE_PRESETS: ScaleGuidePreset[] = [
    {
        key: DEFAULT_SCALE_GUIDE_PRESET_KEY,
        label: "A2 시작 5음 왕복 패턴",
        description: "A2에서 시작해 A3 시작 패턴까지 순차적으로 올라가며, 각 시작음마다 상행 후 하행까지 이어지고 세트 사이에 두 박 쉬는 5음 왕복 스케일 가이드입니다.",
        pattern: {
            version: 1 as const,
            label: "A2-A3 5음 왕복 메이저 스케일",
            description: "A2 B2 C#3 D3 E3까지 올라간 뒤 D3 C#3 B2 A2로 내려오는 패턴을 기준으로, 세트마다 두 박 쉬고 다음 시작음으로 넘어가며 A3 시작 패턴까지 순차적으로 재생합니다.",
            rootNotes: ["A2", "B2", "C#3", "D3", "E3", "F#3", "G#3", "A3"],
            intervals: [0, 2, 4, 5, 7, 5, 4, 2, 0],
            noteNames: [],
            noteDurationMs: 460,
            gapMs: 110,
        },
    },
].map((preset) => ({
    ...preset,
    pattern: {
        ...preset.pattern,
        noteNames: buildNoteSequence(preset.pattern.rootNotes, preset.pattern.intervals),
    },
}));

export function getScaleGuidePreset(presetKey?: string | null) {
    if (!presetKey) {
        return null;
    }

    return SCALE_GUIDE_PRESETS.find((preset) => preset.key === presetKey) || null;
}

export function parseScaleGuidePattern(patternJson?: string | null) {
    if (!patternJson) {
        return null;
    }

    try {
        const parsed = JSON.parse(patternJson) as Partial<ScaleGuidePattern>;

        if (
            parsed &&
            parsed.version === 1 &&
            typeof parsed.label === "string" &&
            typeof parsed.description === "string" &&
            Array.isArray(parsed.noteNames) &&
            parsed.noteNames.every((note) => typeof note === "string") &&
            typeof parsed.noteDurationMs === "number" &&
            typeof parsed.gapMs === "number"
        ) {
            return parsed as ScaleGuidePattern;
        }
    } catch (error) {
        console.error("Failed to parse scale guide pattern:", error);
    }

    return null;
}

export function shouldAutoAttachScaleGuide(title?: string | null) {
    if (!title) {
        return false;
    }

    return /스케일|scale/i.test(title);
}

export function resolveAssignmentScaleGuide(input: {
    title?: string | null;
    guidePresetKey?: string | null;
    guidePatternJson?: string | null;
    guideAudioUrl?: string | null;
}) {
    const guideAudioUrl = input.guideAudioUrl?.trim() || null;
    const preset = getScaleGuidePreset(input.guidePresetKey);

    if (preset) {
        return {
            guideAudioUrl,
            guidePresetKey: preset.key,
            guidePatternJson: JSON.stringify(preset.pattern),
        };
    }

    const parsedPattern = parseScaleGuidePattern(input.guidePatternJson);

    if (parsedPattern) {
        return {
            guideAudioUrl,
            guidePresetKey: input.guidePresetKey?.trim() || null,
            guidePatternJson: JSON.stringify(parsedPattern),
        };
    }

    if (shouldAutoAttachScaleGuide(input.title)) {
        const defaultPreset = getScaleGuidePreset(DEFAULT_SCALE_GUIDE_PRESET_KEY);

        if (defaultPreset) {
            return {
                guideAudioUrl,
                guidePresetKey: defaultPreset.key,
                guidePatternJson: JSON.stringify(defaultPreset.pattern),
            };
        }
    }

    return {
        guideAudioUrl,
        guidePresetKey: null,
        guidePatternJson: null,
    };
}

export function getAssignmentScaleGuidePattern(input: {
    title?: string | null;
    guidePresetKey?: string | null;
    guidePatternJson?: string | null;
}) {
    const directPattern = parseScaleGuidePattern(input.guidePatternJson);

    if (directPattern) {
        return directPattern;
    }

    const preset = getScaleGuidePreset(input.guidePresetKey);

    if (preset) {
        return preset.pattern;
    }

    if (shouldAutoAttachScaleGuide(input.title)) {
        return getScaleGuidePreset(DEFAULT_SCALE_GUIDE_PRESET_KEY)?.pattern || null;
    }

    return null;
}

export function getScaleGuidePresetPreview(presetKey?: string | null) {
    const preset = getScaleGuidePreset(presetKey);

    if (!preset) {
        return null;
    }

    const firstRoot = preset.pattern.rootNotes[0];
    const lastRoot = preset.pattern.rootNotes[preset.pattern.rootNotes.length - 1];

    return `${firstRoot} 시작 -> ${lastRoot} 시작 · 9음 왕복 · 2박 쉼`;
}
