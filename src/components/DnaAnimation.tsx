import type { Component } from "solid-js";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import Zdog from "zdog";

interface DnaAnimationProps {
  width?: number;
  height?: number;
  zoom?: number;
  class?: string;
  turns?: number;
  segmentsPerTurn?: number;
  radius?: number;
  helixHeight?: number;
  strandStroke?: number;
  baseStroke?: number;
  strandAColor?: string;
  strandBColor?: string;
  basePairColors?: string[];
  autoSpin?: boolean;
  spinSpeed?: number;
}

const DnaAnimation: Component<DnaAnimationProps> = (props) => {
  // Refs
  let canvasRef: HTMLCanvasElement | undefined;
  let illo: Zdog.Illustration | undefined;
  let helixAnchor: Zdog.Anchor | undefined;
  let rafId: number | undefined;

  // Shapes that need cleanup
  let strandAShape: Zdog.Shape | undefined;
  let strandBShape: Zdog.Shape | undefined;
  let basePairShapes: Zdog.Shape[] = [];

  // Reactive state
  const [isSpinning, setIsSpinning] = createSignal(props.autoSpin ?? true);
  const [spinZ, setSpinZ] = createSignal(0);

  // Default values with fallbacks
  const width = () => props.width ?? 500;
  const height = () => props.height ?? 500;
  const zoom = () => props.zoom ?? 1.2;
  const turns = () => props.turns ?? 16;
  const segmentsPerTurn = () => props.segmentsPerTurn ?? 24;
  const radius = () => props.radius ?? 40;
  const helixHeight = () => props.helixHeight ?? 3000;
  const strandStroke = () => props.strandStroke ?? 12;
  const baseStroke = () => props.baseStroke ?? 9;
  const strandAColor = () => props.strandAColor ?? "#e74c3c";
  const strandBColor = () => props.strandBColor ?? "#3498db";
  const basePairColors = () => props.basePairColors ?? ["#f39c12", "#9b59b6", "#2ecc71", "#e67e22"];
  const spinSpeed = () => props.spinSpeed ?? 0.01;

  // Helper: Build helix points
  const buildPoints = () => {
    const totalSegments = turns() * segmentsPerTurn();
    const helixA: Zdog.VectorOptions[] = [];
    const helixB: Zdog.VectorOptions[] = [];

    for (let i = 0; i <= totalSegments; i++) {
      const t = i / totalSegments;
      const angle = t * turns() * Zdog.TAU;
      const z = t * helixHeight() - helixHeight() / 2;

      helixA.push({
        x: Math.cos(angle) * radius(),
        y: Math.sin(angle) * radius(),
        z,
      });

      helixB.push({
        x: Math.cos(angle + Math.PI) * radius(),
        y: Math.sin(angle + Math.PI) * radius(),
        z,
      });
    }

    return { helixA, helixB, totalSegments };
  };

  // Helper: Clear existing shapes
  const clearShapes = () => {
    strandAShape?.remove();
    strandBShape?.remove();
    basePairShapes.forEach((s) => {
      s.remove();
    });
    basePairShapes = [];
  };

  // Helper: Build DNA shapes
  const buildShapes = () => {
    if (!helixAnchor) return;

    clearShapes();
    const { helixA, helixB, totalSegments } = buildPoints();

    strandAShape = new Zdog.Shape({
      addTo: helixAnchor,
      path: helixA,
      stroke: strandStroke(),
      color: strandAColor(),
      closed: false,
    });

    strandBShape = new Zdog.Shape({
      addTo: helixAnchor,
      path: helixB,
      stroke: strandStroke(),
      color: strandBColor(),
      closed: false,
    });

    const colors = basePairColors();
    for (let i = 0; i <= totalSegments; i += 4) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = new Zdog.Shape({
        addTo: helixAnchor,
        path: [helixA[i], helixB[i]],
        stroke: baseStroke(),
        color,
      });
      basePairShapes.push(shape);
    }
  };

  // Animation loop
  const animate = () => {
    if (isSpinning()) {
      setSpinZ((prev) => prev + spinSpeed());
      if (helixAnchor) {
        helixAnchor.rotate.z = spinZ();
      }
    }
    illo?.updateRenderGraph();
    rafId = requestAnimationFrame(animate);
  };

  // Initialize on mount
  onMount(() => {
    if (!canvasRef) return;

    illo = new Zdog.Illustration({
      element: canvasRef,
      zoom: zoom(),
      dragRotate: true,
      onDragStart: () => setIsSpinning(false),
      onDragEnd: () => setIsSpinning(true),
    });

    helixAnchor = new Zdog.Anchor({
      addTo: illo,
      rotate: { x: Zdog.TAU / 4, y: -Zdog.TAU / 8 },
    });

    buildShapes();
    animate();
  });

  // Cleanup on unmount
  onCleanup(() => {
    if (rafId) cancelAnimationFrame(rafId);
    clearShapes();
  });

  // React to zoom changes
  createEffect(() => {
    if (illo) {
      illo.zoom = zoom();
    }
  });

  // React to autoSpin prop changes
  createEffect(() => {
    setIsSpinning(props.autoSpin ?? true);
  });

  // React to shape parameter changes
  createEffect(() => {
    // Track all shape-related props
    turns();
    segmentsPerTurn();
    radius();
    helixHeight();
    strandStroke();
    baseStroke();
    strandAColor();
    strandBColor();
    basePairColors();

    // Rebuild if initialized
    if (helixAnchor) {
      buildShapes();
    }
  });

  return (
    <div class={`dna-animation-wrapper ${props.class ?? ""}`}>
      <canvas ref={canvasRef} class="dna-canvas" width={width()} height={height()} />
      <style>
        {`
.dna-animation-wrapper {
display: flex;
justify-content: center;
align-items: center;
}
.dna-canvas {
border-radius: 8px;
background: transparent;
cursor: grab;
user-select: none;
touch-action: none;
}
.dna-canvas:active {
cursor: grabbing;
}
`}
      </style>
    </div>
  );
};

export default DnaAnimation;
