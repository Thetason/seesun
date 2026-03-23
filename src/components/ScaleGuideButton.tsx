"use client";

import { useEffect, useRef, useState } from "react";
import { getAssignmentScaleGuidePattern, type ScaleGuidePattern } from "@/lib/scale-guide";

type ScaleGuideButtonProps = {
    title?: string | null;
    guidePresetKey?: string | null;
    guidePatternJson?: string | null;
    className?: string;
    compact?: boolean;
};

type AudioContextLike = AudioContext & {
    close?: () => Promise<void>;
};

function noteToFrequency(note: string) {
    const match = note.match(/^([A-G])(#|b)?(-?\d)$/);

    if (!match) {
        throw new Error(`Invalid note name: ${note}`);
    }

    const [, baseNote, accidental = "", octaveText] = match;
    const noteOffsets: Record<string, number> = {
        C: 0,
        D: 2,
        E: 4,
        F: 5,
        G: 7,
        A: 9,
        B: 11,
    };

    const accidentalOffset = accidental === "#" ? 1 : accidental === "b" ? -1 : 0;
    const octave = Number(octaveText);
    const midi = (octave + 1) * 12 + noteOffsets[baseNote] + accidentalOffset;

    return 440 * Math.pow(2, (midi - 69) / 12);
}

function createAudioContext() {
    if (typeof window === "undefined") {
        return null;
    }

    const AudioContextConstructor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextConstructor) {
        return null;
    }

    return new AudioContextConstructor() as AudioContextLike;
}

function schedulePianoLikeTone(context: AudioContextLike, frequency: number, startTime: number, durationSeconds: number) {
    const masterGain = context.createGain();
    const lowPassFilter = context.createBiquadFilter();
    lowPassFilter.type = "lowpass";
    lowPassFilter.frequency.setValueAtTime(Math.max(1800, frequency * 7.5), startTime);
    lowPassFilter.Q.setValueAtTime(1.4, startTime);

    const noteCompressor = context.createDynamicsCompressor();
    noteCompressor.threshold.setValueAtTime(-18, startTime);
    noteCompressor.knee.setValueAtTime(18, startTime);
    noteCompressor.ratio.setValueAtTime(2.5, startTime);
    noteCompressor.attack.setValueAtTime(0.003, startTime);
    noteCompressor.release.setValueAtTime(0.16, startTime);

    masterGain.connect(lowPassFilter);
    lowPassFilter.connect(noteCompressor);
    noteCompressor.connect(context.destination);
    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.exponentialRampToValueAtTime(0.26, startTime + 0.018);
    masterGain.gain.exponentialRampToValueAtTime(0.1, startTime + durationSeconds * 0.38);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSeconds);

    const harmonics = [
        { type: "triangle" as OscillatorType, ratio: 1, gain: 0.62, detune: -3 },
        { type: "sine" as OscillatorType, ratio: 2, gain: 0.14, detune: 4 },
        { type: "triangle" as OscillatorType, ratio: 0.5, gain: 0.1, detune: 2 },
        { type: "sine" as OscillatorType, ratio: 3, gain: 0.05, detune: -6 },
    ];

    harmonics.forEach((harmonic) => {
        const oscillator = context.createOscillator();
        const harmonicGain = context.createGain();

        oscillator.type = harmonic.type;
        oscillator.frequency.setValueAtTime(frequency * harmonic.ratio, startTime);
        oscillator.detune.setValueAtTime(harmonic.detune, startTime);
        harmonicGain.gain.setValueAtTime(harmonic.gain, startTime);

        oscillator.connect(harmonicGain);
        harmonicGain.connect(masterGain);

        oscillator.start(startTime);
        oscillator.stop(startTime + durationSeconds + 0.08);
    });

    const noiseBuffer = context.createBuffer(1, Math.max(1, Math.floor(context.sampleRate * 0.018)), context.sampleRate);
    const channel = noiseBuffer.getChannelData(0);

    for (let index = 0; index < channel.length; index += 1) {
        channel[index] = (Math.random() * 2 - 1) * (1 - index / channel.length);
    }

    const noiseSource = context.createBufferSource();
    const noiseGain = context.createGain();
    const noiseFilter = context.createBiquadFilter();

    noiseSource.buffer = noiseBuffer;
    noiseFilter.type = "highpass";
    noiseFilter.frequency.setValueAtTime(1800, startTime);
    noiseGain.gain.setValueAtTime(0.05, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start(startTime);
    noiseSource.stop(startTime + 0.05);
}

export default function ScaleGuideButton({
    title,
    guidePresetKey,
    guidePatternJson,
    className,
    compact = false,
}: ScaleGuideButtonProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const sessionRef = useRef<{ context: AudioContextLike | null; timeoutId: number | null }>({
        context: null,
        timeoutId: null,
    });

    const pattern = getAssignmentScaleGuidePattern({ title, guidePresetKey, guidePatternJson });

    const stopPlayback = async () => {
        if (sessionRef.current.timeoutId) {
            window.clearTimeout(sessionRef.current.timeoutId);
        }

        sessionRef.current.timeoutId = null;

        if (sessionRef.current.context) {
            try {
                await sessionRef.current.context.close?.();
            } catch (error) {
                console.error("Failed to close scale guide audio context:", error);
            }
        }

        sessionRef.current.context = null;
        setIsPlaying(false);
    };

    useEffect(() => {
        return () => {
            void stopPlayback();
        };
    }, []);

    if (!pattern) {
        return null;
    }

    const playPattern = async (nextPattern: ScaleGuidePattern) => {
        const audioContext = createAudioContext();

        if (!audioContext) {
            alert("이 기기에서는 스케일 가이드 재생이 지원되지 않습니다.");
            return;
        }

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        const noteDurationSeconds = nextPattern.noteDurationMs / 1000;
        const gapSeconds = nextPattern.gapMs / 1000;
        const beatSeconds = noteDurationSeconds + gapSeconds;
        const phraseRestSeconds = beatSeconds * 2;
        const phraseLength = Math.max(nextPattern.intervals.length, 1);
        let cursorTime = audioContext.currentTime + 0.04;
        const playbackStartTime = cursorTime;

        nextPattern.noteNames.forEach((noteName, index) => {
            schedulePianoLikeTone(audioContext, noteToFrequency(noteName), cursorTime, noteDurationSeconds);
            cursorTime += noteDurationSeconds + gapSeconds;

            const isEndOfPhrase = (index + 1) % phraseLength === 0;
            const hasNextPhrase = index < nextPattern.noteNames.length - 1;

            if (isEndOfPhrase && hasNextPhrase) {
                cursorTime += phraseRestSeconds;
            }
        });

        const totalDurationMs = Math.ceil((cursorTime - playbackStartTime) * 1000);
        sessionRef.current.context = audioContext;
        sessionRef.current.timeoutId = window.setTimeout(() => {
            void stopPlayback();
        }, totalDurationMs + 400);
        setIsPlaying(true);
    };

    const handleClick = async () => {
        if (isPlaying) {
            await stopPlayback();
            return;
        }

        await playPattern(pattern);
    };

    const previewLabel = `${pattern.rootNotes[0]} 시작 · ${pattern.rootNotes[pattern.rootNotes.length - 1]} 시작까지 왕복 · 세트 사이 2박 쉼`;

    return (
        <button
            type="button"
            onClick={() => {
                void handleClick();
            }}
            className={className}
            style={{
                display: "flex",
                alignItems: compact ? "center" : "flex-start",
                justifyContent: "space-between",
                gap: "0.85rem",
                width: "100%",
                border: "1px solid rgba(255,159,10,0.16)",
                background: "linear-gradient(180deg, rgba(255,159,10,0.12), rgba(255,255,255,0.96))",
                borderRadius: compact ? "14px" : "18px",
                padding: compact ? "12px 14px" : "14px 16px",
                color: "#1d1d1f",
                cursor: "pointer",
                textAlign: "left",
            }}
        >
            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: compact ? "0.76rem" : "0.74rem", fontWeight: 800, color: "#FF9F0A", letterSpacing: "0.06em", marginBottom: "0.35rem" }}>
                    SCALE GUIDE
                </div>
                <div style={{ fontSize: compact ? "0.96rem" : "1rem", fontWeight: 800, lineHeight: 1.35, marginBottom: "0.3rem" }}>
                    {pattern.label}
                </div>
                <div style={{ fontSize: compact ? "0.76rem" : "0.82rem", color: "#6e6e73", lineHeight: 1.55 }}>
                    {previewLabel}
                </div>
            </div>
            <div
                style={{
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: compact ? "88px" : "104px",
                    padding: compact ? "10px 12px" : "12px 14px",
                    borderRadius: "14px",
                    background: isPlaying ? "#1d1d1f" : "#FF9F0A",
                    color: isPlaying ? "#fff" : "#111",
                    fontWeight: 900,
                    fontSize: compact ? "0.82rem" : "0.88rem",
                    boxShadow: isPlaying ? "none" : "0 6px 16px rgba(255,159,10,0.24)",
                }}
            >
                {isPlaying ? "정지" : "🎹 듣기"}
            </div>
        </button>
    );
}
