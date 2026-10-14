import type { CSSProperties } from "react";

const DIM = 4;

const cubes = Array.from({ length: DIM * DIM }, (_, i) => ({
  j: i % DIM,
  k: Math.floor(i / DIM),
}));

/** Isometric 4x4 grid of cubes that rise and fall in a wave. */
export default function CubeLoader() {
  return (
    <div className="cube-loader" aria-hidden="true">
      <div className="cube-loader__grid">
        {cubes.map(({ j, k }) => (
          <div
            key={`${j}-${k}`}
            className="cube-loader__cube"
            style={{ "--j": j, "--k": k } as CSSProperties}
          >
            <div className="cube-loader__lifter">
              <div className="cube-loader__face" />
              <div className="cube-loader__face" />
              <div className="cube-loader__face" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
