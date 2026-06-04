'use client';
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { disperse } from '@/constants/contact';
import gsap from 'gsap';

interface TextDisperseProps {
  children: string; 
  setBackground: (isActive: boolean) => void;
}

function TextDisperse({ children, setBackground }: TextDisperseProps) {
  const [isAnimated, setIsAnimated] = useState(false);

  const TRANSFORMS_LENGTH = 10;

  const splitWord = (word: string) => {
    return word.split("").map((char, i) => (
      <motion.span
        custom={i % TRANSFORMS_LENGTH} 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variants={disperse as any}
        animate={isAnimated ? "open" : "closed"}
        key={`${char}-${i}`}
      >
        {char}
      </motion.span>
    ));
  };

  return (
    <div
      className="flex text-sm lg:text-xl uppercase"
      onMouseEnter={() => {
        setBackground(true);
        setIsAnimated(true);
      }}
      onMouseLeave={() => {
        setBackground(false);
        setIsAnimated(false);
      }}
    >
      {splitWord(children)}
    </div>
  );
}

export default function ContactSection() {
  const background = useRef<HTMLDivElement | null>(null);

  const setBackground = (isActive: boolean) => {
    gsap.to(background.current, { opacity: isActive ? 0.8 : 0, duration: 0.3 });
  };

  return (
    <main className="px-6 lg:px-20 font-secondary h-[50vh]">
      <div className="p-6 lg:p-10 w-full h-full flex flex-col items-center justify-between border-t border-primary ">
        <div className="pb-4">
          <p className="text-xl lg:text-2xl uppercase">Let&apos;s work together!</p>
        </div>
        <div className="w-[70vw] lg:w-[51vw] h-full relative">
        {/* Intro Lines */}
        {/* Interactive Links */}
         <div className="flex font-primary font-semibold justify-between text-sm lg:text-xl uppercase pb-4">
          <p>→Phone</p>
          <TextDisperse setBackground={setBackground}>+84842015618</TextDisperse>
        </div>
        <div className="flex font-primary font-semibold justify-between text-sm lg:text-xl uppercase">
          <p>→Email</p>
          <TextDisperse setBackground={setBackground}>keep.it.inyoureyes@gmail.com</TextDisperse>
        </div>
        </div>
      </div>
      
      {/* Background Layer */}
      <div ref={background} className="absolute inset-0 z-0 opacity-0 pointer-events-none" />
    </main>
  );
}