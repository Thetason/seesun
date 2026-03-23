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

function createReverbImpulse(context: AudioContextLike, durationSeconds = 2.4, decay = 2.8) {
    const frameCount = Math.floor(context.sampleRate * durationSeconds);
    const impulse = context.createBuffer(2, frameCount, context.sampleRate);

    for (let channelIndex = 0; channelIndex < impulse.numberOfChannels; channelIndex += 1) {
        const channel = impulse.getChannelData(channelIndex);

        for (let index = 0; index < channel.length; index += 1) {
            const decayEnvelope = Math.pow(1 - index / channel.length, decay);
            channel[index] = (Math.random() * 2 - 1) * decayEnvelope;
        }
    }

    return impulse;
}

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

function createInstrumentBus(context: AudioContextLike) {
    const input = context.createGain();
    const dryGain = context.createGain();
    const wetGain = context.createGain();
    const convolver = context.createConvolver();
    const busFilter = context.createBiquadFilter();
    const compressor = context.createDynamicsCompressor();

    dryGain.gain.value = 0.92;
    wetGain.gain.value = 0.28;
    convolver.buffer = createReverbImpulse(context);

    busFilter.type = "lowpass";
    busFilter.frequency.value = 4200;
    busFilter.Q.value = 0.8;

    compressor.threshold.value = -20;
    compressor.knee.value = 14;
    compressor.ratio.value = 2.2;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.2;

    input.connect(dryGain);
    dryGain.connect(busFilter);
    input.connect(convolver);
    convolver.connect(wetGain);
    wetGain.connect(busFilter);
    busFilter.connect(compressor);
    compressor.connect(context.destination);

    return input;
}

function schedulePianoLikeTone(
    context: AudioContextLike,
    destination: AudioNode,
    frequency: number,
    startTime: number,
    durationSeconds: number,
    options: { isPreview?: boolean; isAccent?: boolean } = {}
) {
    const noteGain = context.createGain();
    const noteFilter = context.createBiquadFilter();
    noteFilter.type = "lowpass";
    noteFilter.frequency.setValueAtTime(Math.max(1900, frequency * 8.5), startTime);
    noteFilter.Q.setValueAtTime(options.isPreview ? 1.1 : 1.5, startTime);

    noteGain.connect(noteFilter);
    noteFilter.connect(destination);
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(options.isPreview ? 0.24 : 0.2, startTime + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.13, startTime + durationSeconds * 0.62);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSeconds);

    const harmonics = [
        { type: "triangle" as OscillatorType, ratio: 1, gain: options.isAccent ? 0.7 : 0.62, detune: -2 },
        { type: "sine" as OscillatorType, ratio: 2, gain: 0.15, detune: 3 },
        { type: "triangle" as OscillatorType, ratio: 0.5, gain: 0.08, detune: 1 },
        { type: "sine" as OscillatorType, ratio: 3, gain: 0.045, detune: -4 },
    ];

    harmonics.forEach((harmonic) => {
        const oscillator = context.createOscillator();
        const harmonicGain = context.createGain();

        oscillator.type = harmonic.type;
        oscillator.frequency.setValueAtTime(frequency * harmonic.ratio, startTime);
        oscillator.detune.setValueAtTime(harmonic.detune, startTime);
        harmonicGain.gain.setValueAtTime(harmonic.gain, startTime);

        oscillator.connect(harmonicGain);
        harmonicGain.connect(noteGain);

        oscillator.start(startTime);
        oscillator.stop(startTime + durationSeconds + 0.18);
    });

    const noiseBuffer = context.createBuffer(1, Math.max(1, Math.floor(context.sampleRate * 0.02)), context.sampleRate);
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
    noiseGain.gain.setValueAtTime(options.isPreview ? 0.04 : 0.028, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.05);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(noteGain);
    noiseSource.start(startTime);
    noiseSource.stop(startTime + 0.06);
}

function scheduleCountPulse(context: AudioContextLike, destination: AudioNode, startTime: number, accent = false) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.type = accent ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(accent ? 1320 : 1080, startTime);
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(accent ? 1800 : 1500, startTime);
    filter.Q.setValueAtTime(1.8, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(accent ? 0.12 : 0.07, startTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.09);
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
        const phraseLength = Math.max(nextPattern.intervals.length, 1);
        const phraseCount = Math.ceil(nextPattern.noteNames.length / phraseLength);
        const twoBeatLeadSeconds = beatSeconds * 2;
        const instrumentBus = createInstrumentBus(audioContext);
        let phraseCueTime = audioContext.currentTime + 0.08;
        const playbackStartTime = phraseCueTime;

        for (let phraseIndex = 0; phraseIndex < phraseCount; phraseIndex += 1) {
            const phraseStart = phraseCueTime + twoBeatLeadSeconds;
            const phraseNotes = nextPattern.noteNames.slice(phraseIndex * phraseLength, (phraseIndex + 1) * phraseLength);
            const previewNote = phraseNotes[0];

            if (previewNote) {
                schedulePianoLikeTone(audioContext, instrumentBus, noteToFrequency(previewNote), phraseCueTime, beatSeconds * 0.78, { isPreview: true, isAccent: true });
            }

            scheduleCountPulse(audioContext, instrumentBus, phraseCueTime, true);
            scheduleCountPulse(audioContext, instrumentBus, phraseCueTime + beatSeconds, false);

            phraseNotes.forEach((noteName, noteIndex) => {
                const noteStart = phraseStart + noteIndex * beatSeconds;
                scheduleCountPulse(audioContext, instrumentBus, noteStart, noteIndex === 0);
                schedulePianoLikeTone(audioContext, instrumentBus, noteToFrequency(noteName), noteStart, beatSeconds * 1.08, {
                    isAccent: noteIndex === 0,
                });
            });

            phraseCueTime = phraseStart + phraseNotes.length * beatSeconds;
        }

        const totalDurationMs = Math.ceil((phraseCueTime - playbackStartTime) * 1000);
        sessionRef.current.context = audioContext;
        sessionRef.current.timeoutId = window.setTimeout(() => {
            void stopPlayback();
        }, totalDurationMs + 1100);
        setIsPlaying(true);
    };

    const handleClick = async () => {
        if (isPlaying) {
            await stopPlayback();
            return;
        }

        await playPattern(pattern);
    };

    const previewLabel = `${pattern.rootNotes[0]} 시작 · ${pattern.rootNotes[pattern.rootNotes.length - 1]} 시작까지 왕복 · 기준음 + 2박 카운트`;

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
