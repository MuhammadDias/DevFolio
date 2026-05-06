'use client';
import React from 'react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import Image from 'next/image';

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col pb-20 pt-10">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold mt-1 leading-none bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              Elevate your professional presence with <br />
              <span className="text-4xl md:text-[5rem] lg:text-[6rem] font-bold mt-1 leading-none bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">DevFolio</span>
            </h1>
          </>
        }
      >
        <Image src={`https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=3840&auto=format&fit=crop`} alt="hero" height={720} width={1400} className="mx-auto rounded-2xl object-cover h-full object-center" draggable={false} />
      </ContainerScroll>
    </div>
  );
}
