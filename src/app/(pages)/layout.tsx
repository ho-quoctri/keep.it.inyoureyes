import React from 'react';
import { Navbar } from '@/components/layout/navbar';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <aside className="w-[30vw] h-full p-8 flex flex-col justify-center">
        <Navbar/>
      </aside>

      <main className="h-full overflow-y-auto p-12">
        {children}
      </main>
    </div>
  );
}