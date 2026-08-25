"use client"

import dynamic from "next/dynamic"

function SportLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#050505]">
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">LOGONEST</p>
    </div>
  )
}

const JerseyExperience = dynamic(
  () => import("./JerseyExperience").then((m) => m.JerseyExperience),
  { ssr: false, loading: () => <SportLoader /> },
)

export function SportClient() {
  return <JerseyExperience />
}
