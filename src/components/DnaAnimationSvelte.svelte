<script>
  import { onDestroy, onMount } from "svelte";
  import Zdog from "zdog";

  // props!
  const {
    width = 500,
    height = 500,
    zoom = 1.2,
    className = "",
    turns = 16,
    segmentsPerTurn = 24,
    radius = 40,
    helixHeight = 3000,
    strandStroke = 12,
    baseStroke = 9,
    strandAColor = "#e74c3c",
    strandBColor = "#3498db",
    basePairColors = ["#f39c12", "#9b59b6", "#2ecc71", "#e67e22"],
    autoSpin = true,
    spinSpeed = 0.01,
  } = $props();

  let canvasEl;
  let illo, helixAnchor;
  let strandAShape, strandBShape;
  let basePairShapes = [];
  let rafId;

  let isSpinning = $state(autoSpin);
  let spinZ = $state(0);

  function buildPoints() {
    const totalSegments = turns * segmentsPerTurn;
    const helixA = [];
    const helixB = [];

    for (let i = 0; i <= totalSegments; i++) {
      const t = i / totalSegments;
      const angle = t * turns * Zdog.TAU;
      const z = t * helixHeight - helixHeight / 2;

      helixA.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z,
      });
      helixB.push({
        x: Math.cos(angle + Math.PI) * radius,
        y: Math.sin(angle + Math.PI) * radius,
        z,
      });
    }

    return { helixA, helixB, totalSegments };
  }

  function clearShapes() {
    strandAShape?.remove();
    strandBShape?.remove();
    basePairShapes.forEach((s) => s.remove());
    basePairShapes = [];
  }

  function buildShapes() {
    clearShapes();

    const { helixA, helixB, totalSegments } = buildPoints();

    strandAShape = new Zdog.Shape({
      addTo: helixAnchor,
      path: helixA,
      stroke: strandStroke,
      color: strandAColor,
      closed: false,
    });
    strandBShape = new Zdog.Shape({
      addTo: helixAnchor,
      path: helixB,
      stroke: strandStroke,
      color: strandBColor,
      closed: false,
    });

    for (let i = 0; i <= totalSegments; i += 4) {
      const color =
        basePairColors[Math.floor(Math.random() * basePairColors.length)];
      const s = new Zdog.Shape({
        addTo: helixAnchor,
        path: [helixA[i], helixB[i]],
        stroke: baseStroke,
        color,
      });
      basePairShapes.push(s);
    }
  }

  function animate() {
    if (isSpinning) {
      spinZ += spinSpeed;
      helixAnchor.rotate.z = spinZ;
    }
    illo.updateRenderGraph();
    rafId = requestAnimationFrame(animate);
  }

  onMount(() => {
    if (!canvasEl) return;

    illo = new Zdog.Illustration({
      element: canvasEl,
      zoom,
      dragRotate: true,
      onDragStart() {
        isSpinning = false;
      },
      onDragEnd() {
        isSpinning = true;
      },
    });

    helixAnchor = new Zdog.Anchor({
      addTo: illo,
      rotate: { x: Zdog.TAU / 4, y: -Zdog.TAU / 8 },
    });

    buildShapes();
    animate();
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });

  // Reactivity to prop changes
  $effect(() => {
    zoom;
    if (illo) illo.zoom = zoom;
  });
  $effect(() => {
    isSpinning = autoSpin;
    spinSpeed;
  });

  $effect(() => {
    turns;
    segmentsPerTurn;
    radius;
    helixHeight;
    strandStroke;
    baseStroke;
    strandAColor;
    strandBColor;
    basePairColors;
    if (helixAnchor) buildShapes();
  });
</script>

<div class={`dna-animation-wrapper ${className}`}>
  <canvas>
    bind:this={canvasEl}
    class="dna-canvas"
    {width}
    {height}
  </canvas>
</div>

<style>
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
</style>
