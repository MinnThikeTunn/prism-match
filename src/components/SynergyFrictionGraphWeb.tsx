import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Play, 
  Pause, 
  Check, 
  Info, 
  ArrowRight, 
  Layers, 
  Network, 
  SlidersHorizontal,
  Flame,
  Zap,
  X,
  Compass
} from 'lucide-react';

export interface Archetype {
  id: string;
  code?: 'S' | 'O' | 'V' | 'R' | 'C';
  name: string;
  title: string;
  primaryColor: string;
  gradientClass: string;
  bgGradient: string;
  tagline: string;
  behaviorSummary: string;
  cadence: {
    communication: string;
    velocity: string;
    riskProfile: string;
    decisionMaking: string;
  };
  oceanProfile: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    stability: number;
  };
  strengths: string[];
  blindspots: string[];
  optimalCounterpart: string;
}

export interface HarmonicPair {
  archetypeA: string;
  colorA: string;
  archetypeB: string;
  colorB: string;
  synergyScore: number;
  synergyTitle: string;
  description: string;
  frictionRisk: string;
  cadenceBalance?: string;
}

interface GraphNode extends Archetype {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface GraphLink extends HarmonicPair {
  id: string;
  sourceId: string;
  targetId: string;
}

interface SynergyFrictionGraphWebProps {
  archetypes: Archetype[];
  harmonicPairs: HarmonicPair[];
  onOpenChromaticTest?: () => void;
}

export const SynergyFrictionGraphWeb: React.FC<SynergyFrictionGraphWebProps> = ({
  archetypes,
  harmonicPairs,
  onOpenChromaticTest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // View & Filter States
  const [viewMode, setViewMode] = useState<'graph' | 'grid'>('graph');
  const [searchQuery, setSearchQuery] = useState('');
  const [synergyFilter, setSynergyFilter] = useState<'all' | 'high' | 'ultra' | 'friction'>('all');
  const [isPhysicsRunning, setIsPhysicsRunning] = useState(true);

  // Mobile = static, big touch UI (no physics, no canvas)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => {
      setIsMobile(mq.matches);
      if (mq.matches) setIsPhysicsRunning(false);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Selection & Hover States
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<{
    link: GraphLink;
    x: number;
    y: number;
  } | null>(null);

  // Zoom & Pan transform
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Dragging node state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  // Map Archetype Name to Archetype ID
  const nameToId = useMemo(() => {
    const map = new Map<string, string>();
    archetypes.forEach(a => map.set(a.name, a.id));
    return map;
  }, [archetypes]);

  // Initial Graph Nodes positioned evenly in a circle
  const initialNodes = useMemo<GraphNode[]>(() => {
    const count = archetypes.length;
    const centerX = 400;
    const centerY = 300;
    const radius = 190;

    return archetypes.map((arch, index) => {
      const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
      return {
        ...arch,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
        radius: isMobile ? 46 : 28
      };
    });
  }, [archetypes, isMobile]);

  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);

  // Sync nodes if archetypes change
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  // Formulate Graph Links
  const links = useMemo<GraphLink[]>(() => {
    return harmonicPairs.map((pair, idx) => {
      const sourceId = nameToId.get(pair.archetypeA) || archetypes[0].id;
      const targetId = nameToId.get(pair.archetypeB) || archetypes[1].id;
      return {
        ...pair,
        id: `link-${idx}-${sourceId}-${targetId}`,
        sourceId,
        targetId
      };
    });
  }, [harmonicPairs, nameToId, archetypes]);

  // Filtered Links based on search & synergy filter
  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      // Synergy score filter
      if (synergyFilter === 'ultra' && link.synergyScore < 90) return false;
      if (synergyFilter === 'high' && link.synergyScore < 80) return false;
      if (synergyFilter === 'friction' && link.synergyScore >= 75) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = link.synergyTitle.toLowerCase().includes(q);
        const matchesA = link.archetypeA.toLowerCase().includes(q);
        const matchesB = link.archetypeB.toLowerCase().includes(q);
        const matchesDesc = link.description.toLowerCase().includes(q);
        return matchesTitle || matchesA || matchesB || matchesDesc;
      }
      return true;
    });
  }, [links, synergyFilter, searchQuery]);

  // Physics Simulation Loop (Smooth spring-charge force calculation)
  useEffect(() => {
    if (!isPhysicsRunning || isMobile) return;

    let animId: number;
    const simulate = () => {
      setNodes(prevNodes => {
        const nextNodes = prevNodes.map(node => ({ ...node }));
        const centerX = 400;
        const centerY = 300;

        // 1. Coulomb Repulsion between all node pairs
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const n1 = nextNodes[i];
            const n2 = nextNodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const distSq = dx * dx + dy * dy || 1;
            const dist = Math.sqrt(distSq);
            
            // Repulsive force
            const force = 3800 / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (draggedNodeId !== n1.id) {
              n1.vx -= fx;
              n1.vy -= fy;
            }
            if (draggedNodeId !== n2.id) {
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }

        // 2. Spring Attraction along active links
        links.forEach(link => {
          const source = nextNodes.find(n => n.id === link.sourceId);
          const target = nextNodes.find(n => n.id === link.targetId);
          if (!source || !target || source.id === target.id) return;

          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const desiredDist = 180 - (link.synergyScore - 80) * 1.5; // High synergy pulls tighter
          const displacement = dist - desiredDist;
          const springK = 0.0035;

          const fx = (dx / dist) * displacement * springK;
          const fy = (dy / dist) * displacement * springK;

          if (draggedNodeId !== source.id) {
            source.vx += fx;
            source.vy += fy;
          }
          if (draggedNodeId !== target.id) {
            target.vx -= fx;
            target.vy -= fy;
          }
        });

        // 3. Center Gravity & Velocity Damping
        nextNodes.forEach(node => {
          if (draggedNodeId === node.id) {
            node.vx = 0;
            node.vy = 0;
            return;
          }

          const cdx = centerX - node.x;
          const cdy = centerY - node.y;
          node.vx += cdx * 0.0008; // gentle pull to center
          node.vy += cdy * 0.0008;

          // Apply damping / friction
          node.vx *= 0.88;
          node.vy *= 0.88;

          // Apply velocity
          node.x += node.vx;
          node.y += node.vy;

          // Bounding box constraint
          node.x = Math.max(60, Math.min(740, node.x));
          node.y = Math.max(60, Math.min(540, node.y));
        });

        return nextNodes;
      });

      animId = requestAnimationFrame(simulate);
    };

    animId = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animId);
  }, [isPhysicsRunning, links, draggedNodeId, isMobile]);

  // Handle Zoom
  const handleZoom = (direction: 'in' | 'out') => {
    setTransform(prev => {
      const nextScale = direction === 'in' ? Math.min(prev.scale * 1.25, 2.8) : Math.max(prev.scale / 1.25, 0.5);
      return { ...prev, scale: nextScale };
    });
  };

  const handleResetView = () => {
    setTransform({ scale: 1, x: 0, y: 0 });
    setSelectedNodeId(null);
    setSelectedLinkId(null);
  };

  // Tap tracking (touch devices don't reliably fire click after pointer capture)
  const tapRef = useRef<{ nodeId: string | null; x: number; y: number; moved: boolean } | null>(null);

  // Node Drag Handlers (pointer events = mouse + touch + pen)
  const handleNodeMouseDown = (nodeId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    svgRef.current?.setPointerCapture?.(e.pointerId);
    tapRef.current = { nodeId, x: e.clientX, y: e.clientY, moved: false };
    setDraggedNodeId(nodeId);
  };

  const handleCanvasMouseMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (tapRef.current && !tapRef.current.moved) {
      const dx = e.clientX - tapRef.current.x;
      const dy = e.clientY - tapRef.current.y;
      if (Math.hypot(dx, dy) > 8) tapRef.current.moved = true;
    }
    if (draggedNodeId) {
      if (!svgRef.current) return;
      e.preventDefault();
      const rect = svgRef.current.getBoundingClientRect();
      const rawX = (e.clientX - rect.left - transform.x) / transform.scale;
      const rawY = (e.clientY - rect.top - transform.y) / transform.scale;

      setNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: rawX, y: rawY, vx: 0, vy: 0 } : n));
    } else if (isPanning) {
      e.preventDefault();
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, [draggedNodeId, isPanning, panStart, transform]);

  const handleCanvasMouseUp = useCallback((e?: React.PointerEvent<SVGSVGElement>) => {
    if (e && svgRef.current?.hasPointerCapture?.(e.pointerId)) {
      svgRef.current.releasePointerCapture(e.pointerId);
    }
    const tap = tapRef.current;
    tapRef.current = null;
    if (tap && !tap.moved && tap.nodeId) {
      setSelectedNodeId(tap.nodeId);
      setSelectedLinkId(null);
    }
    setDraggedNodeId(null);
    setIsPanning(false);
  }, []);

  const handleCanvasMouseDown = (e: React.PointerEvent<SVGSVGElement>) => {
    // Only pan if clicking on canvas background (not on a node or link)
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'rect') {
      svgRef.current?.setPointerCapture?.(e.pointerId);
      tapRef.current = null;
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };



  // Active selected entities
  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const selectedLink = useMemo(() => {
    return links.find(l => l.id === selectedLinkId) || null;
  }, [links, selectedLinkId]);

  // Determine connected links for selected or hovered node
  const activeFocusNodeId = hoveredNodeId || selectedNodeId;
  const connectedLinkIds = useMemo(() => {
    if (!activeFocusNodeId) return new Set<string>();
    const set = new Set<string>();
    links.forEach(l => {
      if (l.sourceId === activeFocusNodeId || l.targetId === activeFocusNodeId) {
        set.add(l.id);
      }
    });
    return set;
  }, [activeFocusNodeId, links]);

  const connectedNeighborNodeIds = useMemo(() => {
    if (!activeFocusNodeId) return new Set<string>();
    const set = new Set<string>();
    set.add(activeFocusNodeId);
    links.forEach(l => {
      if (l.sourceId === activeFocusNodeId) set.add(l.targetId);
      if (l.targetId === activeFocusNodeId) set.add(l.sourceId);
    });
    return set;
  }, [activeFocusNodeId, links]);

  // When a link is clicked, select that link and deselect standalone node
  const handleLinkClick = (link: GraphLink, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLinkId(link.id);
    setSelectedNodeId(null);
  };

  // When a node is clicked, select that node and deselect link
  const handleNodeClick = (node: GraphNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setSelectedLinkId(null);
  };

  // Hover over link
  const handleLinkMouseEnter = (link: GraphLink, e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHoveredLink({
      link,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleLinkMouseMove = (e: React.MouseEvent) => {
    if (hoveredLink) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      setHoveredLink(prev => prev ? {
        ...prev,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      } : null);
    }
  };

  const handleLinkMouseLeave = () => {
    setHoveredLink(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Perplexity Aesthetic Controls Bar */}
      <div className="bg-white border border-stone-200/90 rounded-[32px] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] text-xs font-bold shadow-2xs">
              <Network className="w-3.5 h-3.5" />
              <span>Obsidian Web Graph: Continuous OKLCH Synergy & Friction Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Pairwise Color Harmonics & Friction Web
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Explore how each behavioral frequency connects with others. Click any <strong>Node</strong> to reveal what the color represents, or hover and click any <strong>Line</strong> to inspect the synergy percentage and the underlying <strong>"Why"</strong>.
            </p>
          </div>

          {/* View Mode Segmented Control */}
          <div className="hidden md:flex items-center gap-2 self-start lg:self-center shrink-0">
            <div className="inline-flex p-1 bg-stone-100/80 rounded-2xl border border-stone-200">
              <button
                onClick={() => setViewMode('graph')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'graph'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                id="obsidian-view-toggle-graph"
              >
                <Network className="w-3.5 h-3.5" />
                <span>Obsidian Web</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                id="obsidian-view-toggle-grid"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Matrix Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search archetype or resonance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-[#7C3AED] text-stone-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            <span className="text-[11px] font-bold text-stone-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Synergy:</span>
            </span>
            {[
              { key: 'all', label: 'All Pairs (15)' },
              { key: 'ultra', label: '⚡ ≥ 92% Ultra' },
              { key: 'high', label: '✨ ≥ 88% High' },
              { key: 'friction', label: '🔥 High Voltage / Friction' },
            ].map(pill => (
              <button
                key={pill.key}
                onClick={() => setSynergyFilter(pill.key as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  synergyFilter === pill.key
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive View Area */}
      {viewMode === 'graph' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center: Obsidian Force Graph Canvas */}
          <div className="lg:col-span-12 xl:col-span-7 bg-[#0E1117] border border-stone-800 rounded-[32px] shadow-lg relative overflow-hidden min-h-[560px] flex flex-col justify-between" ref={containerRef}>
            {/* Top Toolbar Overlay inside Canvas */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              {/* Left: Quick Legend */}
              <div className="bg-stone-900/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full pointer-events-auto flex items-center gap-2.5 text-[11px] text-stone-300 shadow-lg">
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full bg-[#D97706] ${isMobile ? '' : 'animate-pulse'}`} />
                  <span className="font-bold text-white">{archetypes.length}</span> Nodes
                </span>
                <span className="text-stone-600">•</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                  <span className="font-bold text-white">{filteredLinks.length}</span> Resonances
                </span>
              </div>

              {/* Right: Zoom & Physics Controls */}
              <div className="bg-stone-900/80 backdrop-blur-md border border-white/10 p-1 rounded-2xl pointer-events-auto flex items-center gap-1 shadow-lg">
                <button
                  onClick={() => setIsPhysicsRunning(!isPhysicsRunning)}
                  className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                    isPhysicsRunning
                      ? 'text-emerald-400 hover:bg-emerald-500/20'
                      : 'text-amber-400 hover:bg-amber-500/20'
                  }`}
                  title={isPhysicsRunning ? 'Pause Physics' : 'Resume Physics'}
                >
                  {isPhysicsRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleZoom('in')}
                  className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleZoom('out')}
                  className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetView}
                  className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  title="Reset View"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hint Badge at Bottom Left */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
              <div className="bg-stone-900/75 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-2xl text-[11px] text-stone-300 space-y-0.5 shadow-lg">
                <p className="flex items-center gap-1.5 font-medium">
                  <span className="text-amber-400 font-bold">●</span> Click node to inspect color archetype
                </p>
                <p className="flex items-center gap-1.5 font-medium">
                  <span className="text-purple-400 font-bold">—</span> Hover line for synergy %, click for the <strong>Why</strong>
                </p>
              </div>
            </div>

            {/* SVG Force Canvas */}
            <svg
              ref={svgRef}
              viewBox="0 0 800 600"
              className="w-full h-[520px] sm:h-[560px] cursor-grab active:cursor-grabbing select-none"
              style={{ touchAction: 'none' }}
              onPointerDown={handleCanvasMouseDown}
              onPointerMove={handleCanvasMouseMove}
              onPointerUp={handleCanvasMouseUp}
              onPointerCancel={handleCanvasMouseUp}
            >
              <defs>
                {/* Subtle Radial Grid Pattern */}
                <pattern id="grid-dots" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="rgba(255, 255, 255, 0.08)" />
                </pattern>

                {/* Glow Filter for Active Nodes and Edges */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-intense" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="10" result="blur1" />
                  <feGaussianBlur stdDeviation="4" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Dynamic Gradient for each link */}
                {links.map(link => (
                  <linearGradient
                    key={`grad-${link.id}`}
                    id={`grad-${link.id}`}
                    gradientUnits="userSpaceOnUse"
                    x1={nodes.find(n => n.id === link.sourceId)?.x || 0}
                    y1={nodes.find(n => n.id === link.sourceId)?.y || 0}
                    x2={nodes.find(n => n.id === link.targetId)?.x || 0}
                    y2={nodes.find(n => n.id === link.targetId)?.y || 0}
                  >
                    <stop offset="0%" stopColor={link.colorA} />
                    <stop offset="100%" stopColor={link.colorB} />
                  </linearGradient>
                ))}
              </defs>

              {/* Background Rect with Dot Grid */}
              <rect width="800" height="600" fill="#0E1117" />
              <rect width="800" height="600" fill="url(#grid-dots)" />

              {/* Atmospheric central ambient glow */}
              <circle
                cx="400"
                cy="300"
                r="260"
                fill="radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(217,119,6,0.06) 50%, transparent 100%)"
                pointerEvents="none"
              />

              {/* Transform Container for Zoom & Pan */}
              <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
                {/* 1. Render Lines / Links */}
                <g className="links-layer">
                  {filteredLinks.map(link => {
                    const source = nodes.find(n => n.id === link.sourceId);
                    const target = nodes.find(n => n.id === link.targetId);
                    if (!source || !target) return null;

                    // Self-loop (e.g. Dual Solar Pulse)
                    const isSelfLoop = source.id === target.id;
                    const isHovered = hoveredLink?.link.id === link.id;
                    const isSelected = selectedLinkId === link.id;
                    const isConnectedToActiveNode = connectedLinkIds.has(link.id);
                    const isDimmed = activeFocusNodeId && !isConnectedToActiveNode && !isSelected;

                    const strokeWidth = isSelected ? 4.5 : isHovered ? 3.5 : Math.max(1.8, (link.synergyScore - 70) / 7);
                    const opacity = isDimmed ? 0.12 : isSelected ? 1 : isHovered ? 0.95 : isConnectedToActiveNode ? 0.85 : 0.45;

                    if (isSelfLoop) {
                      const loopRadius = 24;
                      const lx = source.x + source.radius + 10;
                      const ly = source.y - 15;
                      return (
                        <g key={link.id} className="cursor-pointer">
                          <circle
                            cx={lx}
                            cy={ly}
                            r={loopRadius}
                            fill="none"
                            stroke={`url(#grad-${link.id})`}
                            strokeWidth={strokeWidth}
                            strokeOpacity={opacity}
                            strokeDasharray={link.synergyScore < 80 ? '4 3' : 'none'}
                            filter={isSelected || isHovered ? 'url(#glow)' : undefined}
                            onMouseEnter={(e) => handleLinkMouseEnter(link, e)}
                            onMouseMove={handleLinkMouseMove}
                            onMouseLeave={handleLinkMouseLeave}
                            onClick={(e) => handleLinkClick(link, e)}
                          />
                        </g>
                      );
                    }

                    return (
                      <g key={link.id} className="cursor-pointer group">
                        {/* Invisible thicker stroke for easy hover targeting */}
                        <line
                          x1={source.x}
                          y1={source.y}
                          x2={target.x}
                          y2={target.y}
                          stroke="transparent"
                          strokeWidth="20"
                          onMouseEnter={(e) => handleLinkMouseEnter(link, e)}
                          onMouseMove={handleLinkMouseMove}
                          onMouseLeave={handleLinkMouseLeave}
                          onClick={(e) => handleLinkClick(link, e)}
                        />

                        {/* Visible glowing vector line */}
                        <line
                          x1={source.x}
                          y1={source.y}
                          x2={target.x}
                          y2={target.y}
                          stroke={`url(#grad-${link.id})`}
                          strokeWidth={strokeWidth}
                          strokeOpacity={opacity}
                          strokeDasharray={link.synergyScore < 60 ? '3 3' : link.synergyScore < 80 ? '6 4' : 'none'}
                          filter={isSelected || isHovered ? 'url(#glow-intense)' : undefined}
                          className="transition-all duration-200"
                          pointerEvents="none"
                        />

                        {/* Midpoint Synergy Particle Pill */}
                        {(isSelected || isHovered || isConnectedToActiveNode) && (
                          <g
                            transform={`translate(${(source.x + target.x) / 2}, ${(source.y + target.y) / 2})`}
                            pointerEvents="none"
                            className="animate-in fade-in zoom-in-75 duration-200"
                          >
                            <rect
                              x="-22"
                              y="-9"
                              width="44"
                              height="18"
                              rx="9"
                              fill="#18181B"
                              stroke={link.synergyScore < 60 ? '#EF4444' : link.colorA}
                              strokeWidth="1.5"
                              filter="url(#glow)"
                            />
                            <text
                              x="0"
                              y="3"
                              textAnchor="middle"
                              fill={link.synergyScore < 60 ? '#FCA5A5' : '#FFFFFF'}
                              fontSize="9"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              {link.synergyScore}%
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* 2. Render Nodes */}
                <g className="nodes-layer">
                  {nodes.map(node => {
                    const isSelected = selectedNodeId === node.id;
                    const isHovered = hoveredNodeId === node.id;
                    const isConnected = connectedNeighborNodeIds.has(node.id);
                    const isDimmed = activeFocusNodeId && !isConnected && !isSelected;

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        className="cursor-pointer group"
                        onPointerDown={(e) => handleNodeMouseDown(node.id, e)}
                        onClick={(e) => handleNodeClick(node, e)}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                      >
                        {/* Outer Pulsing Aura Ring */}
                        <circle
                          r={node.radius + (isSelected ? 16 : isHovered ? 12 : 6)}
                          fill={node.primaryColor}
                          fillOpacity={isDimmed ? 0.03 : isSelected ? 0.35 : isHovered ? 0.25 : 0.12}
                          filter={isSelected || isHovered ? 'url(#glow-intense)' : undefined}
                          className={isMobile ? undefined : 'transition-all duration-300'}
                        />

                        {/* Middle Chromatic Ring */}
                        <circle
                          r={node.radius + (isSelected ? 6 : 3)}
                          fill="none"
                          stroke={node.primaryColor}
                          strokeWidth={isSelected ? 3 : 1.5}
                          strokeOpacity={isDimmed ? 0.2 : 0.8}
                          strokeDasharray={isSelected ? 'none' : '3 2'}
                        />

                        {/* Main Solid Node Circle */}
                        <circle
                          r={node.radius}
                          fill={node.primaryColor}
                          opacity={isDimmed ? 0.35 : 1}
                          filter={isSelected ? 'url(#glow)' : undefined}
                          className={isMobile ? undefined : 'transition-transform duration-200 group-hover:scale-105'}
                        />

                        {/* Inner Core Accent */}
                        <circle
                          r={node.radius - 6}
                          fill="#0E1117"
                          opacity={0.3}
                        />

                        {/* Node Initials or Icon */}
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize={isMobile ? 20 : 13}
                          fontWeight="900"
                          letterSpacing="0.5"
                          pointerEvents="none"
                          opacity={isDimmed ? 0.4 : 1}
                        >
                          {node.code || node.name.replace('The ', '').split(' ').map(w => w[0]).join('')}
                        </text>

                        {/* Node Label Below */}
                        <g transform={`translate(0, ${node.radius + 18})`} pointerEvents="none">
                          <rect
                            x={-(node.name.length * 3.4 + 10)}
                            y="-9"
                            width={node.name.length * 6.8 + 20}
                            height="18"
                            rx="9"
                            fill="#18181B"
                            fillOpacity={isDimmed ? 0.3 : 0.88}
                            stroke={isSelected ? node.primaryColor : 'rgba(255,255,255,0.1)'}
                            strokeWidth={isSelected ? 1.5 : 1}
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fill={isSelected ? '#FFFFFF' : isDimmed ? '#71717A' : '#E4E4E7'}
                            fontSize="10"
                            fontWeight={isSelected ? 'bold' : '600'}
                          >
                            {node.name}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>
              </g>
            </svg>

            {/* Hover Tooltip for Connection Lines (Floating Obsidian Badge) */}
            {hoveredLink && !selectedLinkId && (
              <div
                className="absolute z-30 pointer-events-none bg-stone-950/95 text-white border border-stone-700/80 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in zoom-in-95 duration-150"
                style={{
                  left: `${Math.min(hoveredLink.x + 15, 480)}px`,
                  top: `${Math.min(hoveredLink.y + 15, 420)}px`
                }}
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredLink.link.colorA }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredLink.link.colorB }} />
                    <span className="text-[10px] font-mono text-stone-400">PAIR HARMONIC</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    ⚡ {hoveredLink.link.synergyScore}% Synergy
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1.5">{hoveredLink.link.synergyTitle}</h4>
                <p className="text-[11px] text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                  {hoveredLink.link.description}
                </p>
                <div className="mt-2 pt-1.5 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-amber-400 font-semibold">
                  <span>Click line to inspect "The Why"</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>

          {/* Right / Bottom: Dedicated Obsidian Inspector Panel */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-4">
            {/* Case 1: Line Selected (The "Why" & Friction Analysis) */}
            {selectedLink ? (
              <div className="bg-white border border-stone-200/90 rounded-[32px] p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-200">
                {/* Header Banner */}
                <div className="flex items-start justify-between pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex -space-x-1.5">
                        <span className="w-6 h-6 rounded-full ring-2 ring-white shadow-xs" style={{ backgroundColor: selectedLink.colorA }} />
                        <span className="w-6 h-6 rounded-full ring-2 ring-white shadow-xs" style={{ backgroundColor: selectedLink.colorB }} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                        Pairwise Resonance Diagnostic
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-stone-900 tracking-tight mt-1">
                      {selectedLink.synergyTitle}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedLinkId(null)}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Score & Pairing Overview */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between gap-4 shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                      Pairwise Synergy Score
                    </span>
                    <span className="text-2xl font-black tracking-tight text-white mt-0.5 block">
                      {selectedLink.synergyScore}% Resonance
                    </span>
                    <span className="text-[11px] text-stone-300">
                      {selectedLink.archetypeA} & {selectedLink.archetypeB}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                </div>

                {/* The "Why" - Deep Synergy Explanation */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>The "Why" (Synergy Rationale)</span>
                  </h4>
                  <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/80 text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {selectedLink.description}
                  </div>
                </div>

                {/* Friction Points & Dissonance Mitigation */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>Potential Friction Point & Boundaries</span>
                  </h4>
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-1.5">
                    <p className="text-xs text-amber-950 font-medium leading-relaxed">
                      {selectedLink.frictionRisk}
                    </p>
                    {selectedLink.cadenceBalance && (
                      <div className="pt-2 border-t border-amber-200/50 text-[11px] text-stone-600">
                        <strong className="text-stone-800">Operating Cadence Balance: </strong>
                        {selectedLink.cadenceBalance}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Switch Actions */}
                <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => {
                      const nodeAId = nameToId.get(selectedLink.archetypeA);
                      if (nodeAId) setSelectedNodeId(nodeAId);
                      setSelectedLinkId(null);
                    }}
                    className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl transition-colors text-center text-[11px]"
                  >
                    Inspect {selectedLink.archetypeA.replace('The ', '')}
                  </button>
                  <button
                    onClick={() => {
                      const nodeBId = nameToId.get(selectedLink.archetypeB);
                      if (nodeBId) setSelectedNodeId(nodeBId);
                      setSelectedLinkId(null);
                    }}
                    className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl transition-colors text-center text-[11px]"
                  >
                    Inspect {selectedLink.archetypeB.replace('The ', '')}
                  </button>
                </div>
              </div>
            ) : selectedNode ? (
              /* Case 2: Node Selected (What This Color Is About) */
              <div className="bg-white border border-stone-200/90 rounded-[32px] p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-200">
                {/* Header Banner */}
                <div 
                  className="p-6 rounded-2xl text-white relative overflow-hidden flex flex-col justify-between min-h-[130px] shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${selectedNode.primaryColor}, ${selectedNode.primaryColor}CC)`
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-black/25 px-2.5 py-1 rounded-full backdrop-blur-xs">
                        CHROMATIC COLOR ARCHETYPE
                      </span>
                      <h3 className="text-2xl font-black mt-2 tracking-tight">{selectedNode.name}</h3>
                      <p className="text-xs text-white/90 font-medium">{selectedNode.title}</p>
                    </div>

                    <button
                      onClick={() => setSelectedNodeId(null)}
                      className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-black/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-white/85 italic pt-2 border-t border-white/20 mt-3">
                    "{selectedNode.tagline}"
                  </p>
                </div>

                {/* Behavioral Core */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                    What This Color Is About
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {selectedNode.behaviorSummary}
                  </p>
                </div>

                {/* Operational Cadence */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Communication Rhythm</span>
                    <span className="font-semibold text-stone-800 mt-0.5 block">{selectedNode.cadence.communication}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Velocity Cycle</span>
                    <span className="font-semibold text-stone-800 mt-0.5 block">{selectedNode.cadence.velocity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Risk Tolerance</span>
                    <span className="font-semibold text-stone-800 mt-0.5 block">{selectedNode.cadence.riskProfile}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Decision Protocol</span>
                    <span className="font-semibold text-stone-800 mt-0.5 block">{selectedNode.cadence.decisionMaking}</span>
                  </div>
                </div>

                {/* Strengths and Blindspots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                    <h5 className="font-bold text-emerald-900 flex items-center gap-1.5 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      Key Strengths
                    </h5>
                    <ul className="space-y-1 text-emerald-950 text-[11px]">
                      {selectedNode.strengths.map((s, idx) => (
                        <li key={idx}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                    <h5 className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px]">
                      <Info className="w-3.5 h-3.5 text-amber-700" />
                      Potential Blindspots
                    </h5>
                    <ul className="space-y-1 text-amber-950 text-[11px]">
                      {selectedNode.blindspots.map((b, idx) => (
                        <li key={idx}>• {b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Connected Pairwise Harmonics from this node */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Connected Pairwise Harmonics</span>
                    <span className="text-[10px] font-bold text-purple-700">Click link to inspect Why</span>
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {links
                      .filter(l => l.sourceId === selectedNode.id || l.targetId === selectedNode.id)
                      .map(link => {
                        const otherName = link.sourceId === selectedNode.id ? link.archetypeB : link.archetypeA;
                        const otherColor = link.sourceId === selectedNode.id ? link.colorB : link.colorA;
                        return (
                          <div
                            key={link.id}
                            onClick={(e) => handleLinkClick(link, e)}
                            className="p-2.5 rounded-xl border border-stone-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all cursor-pointer flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: otherColor }} />
                              <div>
                                <span className="font-bold text-stone-900 block">{link.synergyTitle}</span>
                                <span className="text-[10px] text-stone-500">with {otherName}</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {link.synergyScore}%
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              /* Case 3: Empty Default State (Instructions) */
              <div className="bg-white border border-stone-200/90 rounded-[32px] p-8 shadow-xs text-center space-y-5">
                <div className="w-14 h-14 rounded-full bg-purple-50 text-[#7C3AED] mx-auto flex items-center justify-center">
                  <Compass className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-stone-900">
                    Select a Node or Connection Line
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Click any archetype node in the graph web to see its behavioral definition and cognitive cadence, or click any connecting vector to inspect the <strong>Synergy Percentage</strong> and <strong>The Why</strong>.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-left space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-stone-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                    <span>Solar Gold (Execution Velocity)</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0A6275]" />
                    <span>Oceanic Teal (Systems Logic)</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                    <span>Verdant Emerald (Team Empathy)</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                    <span>Royal Amethyst (Vision & Synthesis)</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
                    <span>Cobalt Blue (Operational Reliability)</span>
                  </div>
                </div>

                {onOpenChromaticTest && (
                  <button
                    onClick={onOpenChromaticTest}
                    className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Discover Your Personal Color Archetype</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Alternate Matrix Grid View (Preserving all original content in card format) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {filteredLinks.map((pair, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 rounded-[28px] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all group"
            >
              <div>
                {/* Top Row */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <span className="w-6 h-6 rounded-full ring-2 ring-white shadow-xs" style={{ backgroundColor: pair.colorA }} />
                      <span className="w-6 h-6 rounded-full ring-2 ring-white shadow-xs" style={{ backgroundColor: pair.colorB }} />
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-purple-700 transition-colors">
                      {pair.synergyTitle}
                    </h4>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {pair.synergyScore}% Synergy
                  </span>
                </div>

                <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                  {pair.description}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-[11px]">
                  <span className="font-bold text-amber-900 block mb-0.5">Potential Friction Point:</span>
                  <span className="text-amber-950">{pair.frictionRisk}</span>
                </div>

                {pair.cadenceBalance && (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-[11px]">
                    <span className="font-bold text-stone-700 block mb-0.5">Cadence Harmony:</span>
                    <span className="text-stone-500">{pair.cadenceBalance}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
