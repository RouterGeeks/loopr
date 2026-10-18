import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LoopItem } from '../lib/loops';

type Point = { x: number; y: number };

export default function ThoughtConstellation({ thought, neighbors }: { thought: LoopItem; neighbors: LoopItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  // Measure actual dot centers so lines stay attached as labels/font sizes reflow.
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      setPoints(Array.from(element.querySelectorAll('.dot-circle')).map(dot => {
        const rect = dot.getBoundingClientRect();
        return { x: rect.left + rect.width / 2 - bounds.left, y: rect.top + rect.height / 2 - bounds.top };
      }));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll('.thought-dot').forEach(dot => observer.observe(dot));
    return () => observer.disconnect();
  }, [thought, neighbors]);

  const node = (item: LoopItem, index: number) => <Link key={item.id}
    className={`thought-dot ${index === -1 ? 'thought-dot-center' : `thought-dot-${index}`}`}
    to={`/thoughts/${item.id}`} state={{ connectionOrigin: thought.id }}
    aria-label={`Open thought: ${item.text}`} title={item.text}>
    <span className="dot-circle" aria-hidden="true" />
    <span className="dot-text">{item.text}</span>
  </Link>;

  return <div ref={root} aria-label="Connected thoughts" className="thought-graph">
    <svg className="constellation-lines" aria-hidden="true" focusable="false">
      {points[0] && points.slice(1).map((point, index) => <line key={index}
        x1={points[0].x} y1={points[0].y} x2={point.x} y2={point.y} />)}
    </svg>
    {node(thought, -1)}
    {neighbors.map((item, index) => node(item, index))}
  </div>;
}
