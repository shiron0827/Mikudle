import React, { useRef, useEffect, useCallback, useState } from "react";

interface WaveformProps {
    waveformData: Float32Array;
    maxAmplitude: number;
    progress: number;              // 0 -> 1
    onSeek: (time: number) => void;
    duration: number;              // seconds
    height?: number;
    width?: number;
}

interface PointCoordinatesArgs {
    index: number;
    pointWidth: number;
    pointMargin: number;
    canvasHeight: number;
    amplitude: number;
    maxAmplitude: number;
}

const pointCoordinates = ({
    index,
    pointWidth,
    pointMargin,
    canvasHeight,
    amplitude,
    maxAmplitude
}: PointCoordinatesArgs) => {
    const waveSpaceMult = 0.6;
    // Calculate waveform height
    if(maxAmplitude == 0) maxAmplitude = 0.1;
    let pointHeight = Math.round(
        (amplitude / maxAmplitude) * canvasHeight * waveSpaceMult
    );

    if (pointHeight < 1) {
        pointHeight = 1;
    }

    // Baseline for the waveform.
    // Higher value = waveform sits lower on the canvas.
    const baseline = Math.round(canvasHeight * waveSpaceMult);

    // Main waveform extends upward from the baseline
    const mainY = baseline - pointHeight;

    // Reflection is smaller than the main waveform
    const reflectionHeight = Math.round(pointHeight * (1-waveSpaceMult));

    return {
        x: index * (pointWidth + pointMargin),
        mainY,
        mainHeight: pointHeight,
        reflectionY: baseline,
        reflectionHeight,
    };
};

export default function Waveform({
    waveformData,
    maxAmplitude,
    progress,
    duration,
    onSeek,
    width = 500,
    height = 120,
}: WaveformProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const pointWidth = 4;
    const pointMargin = 1;

    const [hoverX, setHoverX] = useState<number | null>(null);

    const playingPoint =
        (progress * width) / (pointWidth + pointMargin);

    const paintWaveform = useCallback(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        waveformData.forEach((amp, index) => {
            const coords = pointCoordinates({
                index,
                pointWidth,
                pointMargin,
                canvasHeight: height,
                amplitude: amp,
                maxAmplitude
            });

            const withinHover =
                hoverX !== null && hoverX >= coords.x;

            const alreadyPlayed =
                index < playingPoint;

            // =================================
            // Main waveform
            // =================================

            if (withinHover) {
                ctx.fillStyle = alreadyPlayed
                    ? "#94b398"
                    : "#badebf";
            } else {
                ctx.fillStyle = alreadyPlayed
                    ? "#47a463"
                    : "#88bf99";
            }

            ctx.fillRect(
                coords.x,
                coords.mainY,
                pointWidth,
                coords.mainHeight
            );

            // =================================
            // Reflection
            // =================================

            const gradient = ctx.createLinearGradient(
                0,
                coords.reflectionY,
                0,
                coords.reflectionY + coords.reflectionHeight
            );

            if (withinHover) {
                gradient.addColorStop(
                    0,
                    "rgba(186, 222, 191, 0.7)"
                );

                gradient.addColorStop(
                    0.5,
                    "rgba(186, 222, 191, 0.45)"
                );

                gradient.addColorStop(
                    1,
                    "rgba(186, 222, 191, 0)"
                );
            } else {
                gradient.addColorStop(
                    0,
                    "rgba(136, 191, 153, 0.35)"
                );

                gradient.addColorStop(
                    0.5,
                    "rgba(136, 191, 153, 0.22)"
                );

                gradient.addColorStop(
                    1,
                    "rgba(136, 191, 153, 0)"
                );
            }

            ctx.fillStyle = gradient;

            ctx.fillRect(
                coords.x,
                coords.reflectionY,
                pointWidth,
                coords.reflectionHeight
            );
        });
    }, [
        waveformData,
        maxAmplitude,
        playingPoint,
        hoverX,
        width,
        height,
    ]);

    useEffect(() => {
        paintWaveform();
    }, [paintWaveform]);

    const handleMouseMove = (
        e: React.MouseEvent<HTMLCanvasElement>
    ) => {
        if (!canvasRef.current) return;

        const rect =
            canvasRef.current.getBoundingClientRect();

        setHoverX(e.clientX - rect.left);
    };

    const handleMouseLeave = () => {
        setHoverX(null);
    };

    const handleClick = (
        e: React.MouseEvent<HTMLCanvasElement>
    ) => {
        if (!canvasRef.current) return;

        const rect =
            canvasRef.current.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const percent = x / rect.width;

        console.log(percent);

        onSeek(percent * duration);

        console.log(duration);
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
                display: "block",
                height,
                cursor: "pointer",
                justifySelf: "center"
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        />
    );
}