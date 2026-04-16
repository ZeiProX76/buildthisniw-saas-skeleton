"use client";

import BoltMark from "./bolt-mark";
import FacetedBolt from "./faceted-bolt";
import PrismBolt from "./prism-bolt";
import IsoCube from "./iso-cube";
import TriPrism from "./tri-prism";
import HexStack from "./hex-stack";
import GeoB from "./geo-b";
import DiamondFacet from "./diamond-facet";
import ArrowBlock from "./arrow-block";

const logos = [
  { name: "Iso Cube", desc: "Isometric cube — 3 gradient faces, clean geometry", Component: IsoCube },
  { name: "Tri Prism", desc: "Triangular prism pointing up — launch/build/go", Component: TriPrism },
  { name: "Hex Stack", desc: "Three hexagonal layers stacked — building blocks", Component: HexStack },
  { name: "Geo B", desc: "Letter B from geometric blocks — direct brand initial", Component: GeoB },
  { name: "Diamond Facet", desc: "Four-face diamond — precision, value, quality", Component: DiamondFacet },
  { name: "Arrow Block", desc: "3D extruded arrow pointing up — momentum, direction", Component: ArrowBlock },
  { name: "Bolt Mark", desc: "Classic gradient bolt with highlight for 3D depth", Component: BoltMark },
  { name: "Faceted Bolt", desc: "Crystal-split bolt — lit/shadow faces like a gem", Component: FacetedBolt },
  { name: "Prism Bolt", desc: "Chunky bolt with glow halo — works favicon to hero", Component: PrismBolt },
];

export default function LogoPreview() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Build This Now — Logo Variations</h1>
      <p className="text-muted-foreground mb-12">
        All use the button gradient. No background containers. Gradient-filled geometric marks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {logos.map(({ name, desc, Component }) => (
          <div key={name} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{name}</h2>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>

            {/* Light — multiple sizes */}
            <div className="rounded-xl border border-border bg-white p-6 flex items-center justify-center gap-6">
              <Component size={20} />
              <Component size={32} />
              <Component size={48} />
              <Component size={72} />
            </div>

            {/* Dark — multiple sizes */}
            <div className="rounded-xl border border-border bg-[#0a0a0a] p-6 flex items-center justify-center gap-6">
              <Component size={20} />
              <Component size={32} />
              <Component size={48} />
              <Component size={72} />
            </div>

            {/* Wordmark pairing — light */}
            <div className="rounded-xl border border-border bg-white p-5 flex items-center gap-3">
              <Component size={32} />
              <span className="text-base font-bold text-[#1a1a2e] tracking-tight">Build This Now</span>
            </div>

            {/* Wordmark pairing — dark */}
            <div className="rounded-xl border border-border bg-[#0a0a0a] p-5 flex items-center gap-3">
              <Component size={32} />
              <span className="text-base font-bold text-white tracking-tight">Build This Now</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
