"use client";

import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type ImpactBeforeAfterProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  label: string;
  className?: string;
  sizes?: string;
};

export function ImpactBeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  label,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ImpactBeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positionPct, setPositionPct] = useState(50);
  const draggingRef = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    setPositionPct(clamp((x / rect.width) * 100, 2, 98));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    draggingRef.current = true;
    containerRef.current?.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    setFromClientX(e.clientX);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const beforeClipWidth = Math.max(positionPct, 2);
  const beforeInnerWidthPct = (100 / beforeClipWidth) * 100;

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[4/3] w-full cursor-ew-resize touch-none overflow-hidden rounded-[var(--radius-xl)] bg-secondary shadow-2xl select-none ${className ?? ""}`}
      aria-label={label}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(positionPct)}
      aria-valuetext={`${Math.round(positionPct)} percent before image visible`}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 10 : 5;
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          setPositionPct((p) => clamp(p - step, 2, 98));
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          setPositionPct((p) => clamp(p + step, 2, 98));
        } else if (e.key === "Home") {
          e.preventDefault();
          setPositionPct(2);
        } else if (e.key === "End") {
          e.preventDefault();
          setPositionPct(98);
        }
      }}
    >
      <div className="absolute inset-0 h-full w-full">
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          sizes={sizes}
          className="object-cover"
          draggable={false}
        />
        <div className="pointer-events-none absolute right-4 top-4 rounded bg-accent/90 px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-accent-foreground">
          After
        </div>
      </div>

      <div
        className="absolute inset-y-0 left-0 z-10 overflow-hidden border-r-4 border-white"
        style={{ width: `${positionPct}%` }}
      >
        <div className="relative h-full min-h-0" style={{ width: `${beforeInnerWidthPct}%` }}>
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            sizes={sizes}
            className="object-cover grayscale filter"
            draggable={false}
          />
        </div>
        <div className="pointer-events-none absolute left-4 top-4 rounded bg-black/60 px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-white">
          Before
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 z-20 w-1 -translate-x-1/2 bg-white shadow-md"
        style={{ left: `${positionPct}%` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 z-30 flex -translate-x-1/2 items-center justify-center"
        style={{ left: `${positionPct}%` }}
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-4 ring-black/10">
          <ChevronsLeftRight className="size-5" aria-hidden />
        </div>
      </div>
    </div>
  );
}
