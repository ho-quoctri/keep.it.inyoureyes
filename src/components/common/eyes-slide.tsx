"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { IMAGES } from "@/lib/images";

export const EyesSlide = () => {
    const frames = [
        IMAGES.eyes.slide,
        IMAGES.eyes.slide1,
        IMAGES.eyes.slide2,
        IMAGES.eyes.slide3,
        IMAGES.eyes.slide4,
        IMAGES.eyes.slide5,
    ];
    const [frameIndex, setFrameIndex] = useState(0);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setFrameIndex((current) => (current + 1) % frames.length);
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [frames.length]);

    return (
        <div className="flex h-full items-center">
            <div>*(</div>
            <div className="pt-4 pl-2">
                <Image
                    src={frames[frameIndex]}
                    alt="Eyes Slide"
                    width={120}
                    height={120}
                    className="object-contain interactive"
                    priority
                />
            </div>
            <div>)</div>
        </div>
    );
};