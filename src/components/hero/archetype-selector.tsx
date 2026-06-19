"use client"

import { useState } from "react"
import { motion } from "framer-motion"

type Archetype = "male" | "female" | null

const F = "oklch(0.94 0.01 85 / 0.92)"   // body fill
const D = "oklch(0.07 0.01 85 / 0.88)"   // dark panel / visor
const E = "oklch(0.98 0.01 85 / 0.22)"   // panel edge highlight

function glow(on: boolean) {
  return on
    ? "drop-shadow(0 0 28px oklch(0.72 0.14 72 / 0.78)) drop-shadow(0 0 8px oklch(0.72 0.14 72 / 0.42))"
    : "none"
}

// ─── Male figure — viewBox 0 0 120 320 ────────────────────────────────────────
function MaleFigure({ selected }: { selected: boolean }) {
  return (
    <svg
      viewBox="0 0 120 320"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMax meet"
      style={{ filter: glow(selected), transition: "filter 0.35s ease" }}
    >
      {/* HEAD */}
      <ellipse cx="60" cy="29" rx="25" ry="28" fill={F} />
      {/* dome specular */}
      <ellipse cx="52" cy="18" rx="9" ry="7" fill={E} />
      {/* visor band */}
      <rect x="39" y="25" width="42" height="14" rx="5" fill={D} />
      {/* visor inner tint — gold when selected */}
      <rect x="41" y="27" width="38" height="10" rx="3"
        fill={selected ? "oklch(0.72 0.14 72 / 0.28)" : "oklch(0.72 0.14 72 / 0.07)"} />

      {/* NECK */}
      <rect x="53" y="55" width="14" height="16" rx="4" fill={F} />
      <rect x="52" y="60" width="16" height="2.5" rx="1" fill={D} opacity="0.5" />
      <rect x="52" y="65" width="16" height="2.5" rx="1" fill={D} opacity="0.5" />

      {/* SHOULDER JOINTS */}
      <circle cx="20" cy="88" r="17" fill={F} />
      <circle cx="20" cy="88" r="10" fill={D} opacity="0.32" />
      <circle cx="100" cy="88" r="17" fill={F} />
      <circle cx="100" cy="88" r="10" fill={D} opacity="0.32" />

      {/* TORSO — V-taper */}
      {/* shoulder bridge rects fill gap between shoulder circles and torso path */}
      <rect x="25" y="70" width="20" height="24" rx="4" fill={F} />
      <rect x="75" y="70" width="20" height="24" rx="4" fill={F} />
      <path d="M 32,70 L 88,70 L 84,156 L 36,156 Z" fill={F} />
      {/* chest panel */}
      <rect x="43" y="78" width="34" height="26" rx="4" fill={D} opacity="0.52" />
      <rect x="52" y="80" width="2" height="22" rx="1" fill={E} opacity="0.55" />
      <rect x="66" y="80" width="2" height="22" rx="1" fill={E} opacity="0.55" />
      <rect x="43" y="88" width="34" height="2" rx="1" fill={E} opacity="0.45" />
      {/* belly segment */}
      <rect x="46" y="114" width="28" height="24" rx="4" fill={D} opacity="0.28" />

      {/* HIP BLOCK */}
      <path d="M 34,154 L 86,154 L 88,180 L 32,180 Z" fill={F} />
      <rect x="44" y="162" width="32" height="10" rx="3" fill={D} opacity="0.28" />

      {/* LEFT ARM */}
      <rect x="5" y="88" width="21" height="52" rx="10" fill={F} />
      <rect x="6" y="104" width="19" height="2.5" rx="1" fill={D} opacity="0.38" />
      {/* L elbow joint */}
      <circle cx="15" cy="144" r="13" fill={F} />
      <circle cx="15" cy="144" r="7.5" fill={D} opacity="0.32" />
      {/* L forearm */}
      <rect x="7" y="148" width="17" height="42" rx="8" fill={F} />
      {/* L fist */}
      <ellipse cx="15" cy="196" rx="13" ry="10" fill={F} />
      <ellipse cx="15" cy="191" rx="7" ry="4" fill={D} opacity="0.28" />

      {/* RIGHT ARM */}
      <rect x="94" y="88" width="21" height="52" rx="10" fill={F} />
      <rect x="95" y="104" width="19" height="2.5" rx="1" fill={D} opacity="0.38" />
      {/* R elbow joint */}
      <circle cx="105" cy="144" r="13" fill={F} />
      <circle cx="105" cy="144" r="7.5" fill={D} opacity="0.32" />
      {/* R forearm */}
      <rect x="96" y="148" width="17" height="42" rx="8" fill={F} />
      {/* R fist */}
      <ellipse cx="105" cy="196" rx="13" ry="10" fill={F} />
      <ellipse cx="105" cy="191" rx="7" ry="4" fill={D} opacity="0.28" />

      {/* LEFT LEG */}
      <rect x="33" y="180" width="23" height="58" rx="11" fill={F} />
      <rect x="35" y="198" width="19" height="2.5" rx="1" fill={D} opacity="0.38" />
      {/* L knee */}
      <circle cx="44" cy="242" r="14" fill={F} />
      <circle cx="44" cy="242" r="8" fill={D} opacity="0.32" />
      {/* L shin */}
      <rect x="36" y="248" width="18" height="50" rx="8" fill={F} />
      <rect x="37" y="266" width="16" height="2.5" rx="1" fill={D} opacity="0.32" />
      {/* L boot */}
      <rect x="27" y="293" width="30" height="15" rx="6" fill={F} />

      {/* RIGHT LEG */}
      <rect x="64" y="180" width="23" height="58" rx="11" fill={F} />
      <rect x="66" y="198" width="19" height="2.5" rx="1" fill={D} opacity="0.38" />
      {/* R knee */}
      <circle cx="76" cy="242" r="14" fill={F} />
      <circle cx="76" cy="242" r="8" fill={D} opacity="0.32" />
      {/* R shin */}
      <rect x="66" y="248" width="18" height="50" rx="8" fill={F} />
      <rect x="67" y="266" width="16" height="2.5" rx="1" fill={D} opacity="0.32" />
      {/* R boot */}
      <rect x="63" y="293" width="30" height="15" rx="6" fill={F} />
    </svg>
  )
}

// ─── Female figure — same viewBox, different proportions ─────────────────────
function FemaleFigure({ selected }: { selected: boolean }) {
  return (
    <svg
      viewBox="0 0 120 320"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMax meet"
      style={{ filter: glow(selected), transition: "filter 0.35s ease" }}
    >
      {/* HEAD — slightly rounder */}
      <ellipse cx="60" cy="27" rx="22" ry="25" fill={F} />
      <ellipse cx="52" cy="17" rx="8" ry="6" fill={E} />
      {/* visor — narrower */}
      <rect x="42" y="23" width="36" height="12" rx="5" fill={D} />
      <rect x="44" y="25" width="32" height="8" rx="3"
        fill={selected ? "oklch(0.72 0.14 72 / 0.28)" : "oklch(0.72 0.14 72 / 0.07)"} />

      {/* NECK */}
      <rect x="54" y="50" width="12" height="14" rx="4" fill={F} />
      <rect x="53" y="55" width="14" height="2" rx="1" fill={D} opacity="0.5" />
      <rect x="53" y="60" width="14" height="2" rx="1" fill={D} opacity="0.5" />

      {/* SHOULDER JOINTS — smaller, more inset */}
      <circle cx="24" cy="82" r="13" fill={F} />
      <circle cx="24" cy="82" r="7.5" fill={D} opacity="0.32" />
      <circle cx="96" cy="82" r="13" fill={F} />
      <circle cx="96" cy="82" r="7.5" fill={D} opacity="0.32" />

      {/* TORSO — hourglass with waist curve */}
      {/* shoulder bridges */}
      <rect x="28" y="64" width="14" height="20" rx="4" fill={F} />
      <rect x="78" y="64" width="14" height="20" rx="4" fill={F} />
      {/* hourglass: wide top → narrow waist → hip flare */}
      <path d="M 38,64 L 82,64 L 76,116 L 80,152 L 40,152 L 44,116 Z" fill={F} />
      {/* chest panel */}
      <rect x="45" y="72" width="30" height="24" rx="4" fill={D} opacity="0.5" />
      <rect x="53" y="74" width="2" height="20" rx="1" fill={E} opacity="0.55" />
      <rect x="65" y="74" width="2" height="20" rx="1" fill={E} opacity="0.55" />
      <rect x="45" y="83" width="30" height="2" rx="1" fill={E} opacity="0.45" />
      {/* waist detail */}
      <rect x="48" y="108" width="24" height="18" rx="3" fill={D} opacity="0.22" />

      {/* HIP BLOCK — wider than torso */}
      <path d="M 27,150 L 93,150 L 95,176 L 25,176 Z" fill={F} />
      <rect x="37" y="158" width="46" height="10" rx="3" fill={D} opacity="0.28" />

      {/* LEFT ARM — slimmer */}
      <rect x="9" y="82" width="17" height="48" rx="8" fill={F} />
      <rect x="10" y="97" width="15" height="2" rx="1" fill={D} opacity="0.38" />
      {/* L elbow */}
      <circle cx="17" cy="134" r="11" fill={F} />
      <circle cx="17" cy="134" r="6.5" fill={D} opacity="0.32" />
      {/* L forearm */}
      <rect x="10" y="137" width="14" height="40" rx="7" fill={F} />
      {/* L fist */}
      <ellipse cx="17" cy="183" rx="11" ry="9" fill={F} />

      {/* RIGHT ARM */}
      <rect x="94" y="82" width="17" height="48" rx="8" fill={F} />
      <rect x="95" y="97" width="15" height="2" rx="1" fill={D} opacity="0.38" />
      {/* R elbow */}
      <circle cx="103" cy="134" r="11" fill={F} />
      <circle cx="103" cy="134" r="6.5" fill={D} opacity="0.32" />
      {/* R forearm */}
      <rect x="96" y="137" width="14" height="40" rx="7" fill={F} />
      {/* R fist */}
      <ellipse cx="103" cy="183" rx="11" ry="9" fill={F} />

      {/* LEFT LEG — wider stance for hip proportion */}
      <rect x="27" y="176" width="21" height="56" rx="10" fill={F} />
      <rect x="29" y="194" width="17" height="2" rx="1" fill={D} opacity="0.38" />
      {/* L knee */}
      <circle cx="37" cy="236" r="13" fill={F} />
      <circle cx="37" cy="236" r="7.5" fill={D} opacity="0.32" />
      {/* L shin */}
      <rect x="29" y="241" width="16" height="50" rx="7" fill={F} />
      <rect x="30" y="259" width="14" height="2" rx="1" fill={D} opacity="0.30" />
      {/* L boot */}
      <rect x="21" y="287" width="27" height="13" rx="5" fill={F} />

      {/* RIGHT LEG */}
      <rect x="72" y="176" width="21" height="56" rx="10" fill={F} />
      <rect x="74" y="194" width="17" height="2" rx="1" fill={D} opacity="0.38" />
      {/* R knee */}
      <circle cx="83" cy="236" r="13" fill={F} />
      <circle cx="83" cy="236" r="7.5" fill={D} opacity="0.32" />
      {/* R shin */}
      <rect x="75" y="241" width="16" height="50" rx="7" fill={F} />
      <rect x="76" y="259" width="14" height="2" rx="1" fill={D} opacity="0.30" />
      {/* R boot */}
      <rect x="72" y="287" width="27" height="13" rx="5" fill={F} />
    </svg>
  )
}

// ─── Selector ─────────────────────────────────────────────────────────────────
export function ArchetypeSelector() {
  const [selected, setSelected] = useState<Archetype>(null)

  const toggle = (a: "male" | "female") =>
    setSelected(prev => (prev === a ? null : a))

  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full h-full py-16 px-6 select-none">

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4"
      >
        <span className="h-px w-8 bg-primary/35" />
        <p className="text-[9px] font-medium tracking-[0.34em] uppercase text-primary/55">
          Choose Your Archetype
        </p>
        <span className="h-px w-8 bg-primary/35" />
      </motion.div>

      {/* Figures */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95, duration: 0.9 }}
        className="flex items-end justify-center gap-10 w-full"
      >

        {/* Male */}
        <motion.div
          onClick={() => toggle("male")}
          className="flex flex-col items-center gap-4 cursor-pointer"
          animate={{ opacity: selected !== null && selected !== "male" ? 0.25 : 1 }}
          whileHover={{ scale: selected !== null && selected !== "male" ? 1 : 1.025 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: "1 1 0", maxWidth: "155px" }}
        >
          <div style={{ height: "clamp(260px, 52vh, 440px)", width: "100%" }}>
            <MaleFigure selected={selected === "male"} />
          </div>
          <p className={`text-[8px] font-medium tracking-[0.3em] uppercase transition-colors duration-300 ${
            selected === "male" ? "text-primary" : "text-foreground/30"
          }`}>
            Male
          </p>
        </motion.div>

        {/* Female */}
        <motion.div
          onClick={() => toggle("female")}
          className="flex flex-col items-center gap-4 cursor-pointer"
          animate={{ opacity: selected !== null && selected !== "female" ? 0.25 : 1 }}
          whileHover={{ scale: selected !== null && selected !== "female" ? 1 : 1.025 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: "1 1 0", maxWidth: "142px" }}
        >
          <div style={{ height: "clamp(260px, 52vh, 440px)", width: "100%" }}>
            <FemaleFigure selected={selected === "female"} />
          </div>
          <p className={`text-[8px] font-medium tracking-[0.3em] uppercase transition-colors duration-300 ${
            selected === "female" ? "text-primary" : "text-foreground/30"
          }`}>
            Female
          </p>
        </motion.div>

      </motion.div>
    </div>
  )
}
