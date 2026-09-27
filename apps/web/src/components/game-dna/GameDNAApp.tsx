"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight, Bot, ChevronDown, CircleGauge, Dna, Search, ShieldCheck,
  SlidersHorizontal, Sparkles, Target, Ticket, Trash2, TrendingUp, X,
} from "lucide-react";
import { GameDNAForecast, shortTeam, weekThreeForecasts } from "@/lib/game-dna-data";

type ParlayLeg = { game: GameDNAForecast; line: number; probability: number };

const normalCdf = (x: number) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  let p = 1 - d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x < 0) p = 1 - p;
  return p;
};

const coverProbability = (fairMargin: number, line: number) =>
  Math.max(1, Math.min(99, normalCdf((fairMargin - Math.abs(line)) / 13.45) * 100));

const fairAmerican = (probability: number) => {
  const p = probability / 100;
  if (p >= 0.5) return Math.round((-100 * p) / (1 - p));
  return Math.round((100 * (1 - p)) / p);
};

const signed = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
const pct = (value: number) => `${value.toFixed(1)}%`;

export default function GameDNAApp() {
  const [query, setQuery] = useState("");
  const [assistant, setAssistant] = useState("");
  const [assistantReply, setAssistantReply] = useState("Ask for a game or tell Game DNA to build a safer parlay.");
  const [book, setBook] = useState("FanDuel");
  const [selected, setSelected] = useState<GameDNAForecast>(weekThreeForecasts[4]);
  const [line, setLine] = useState(-5.5);
  const [legs, setLegs] = useState<ParlayLeg[]>([]);
  const [view, setView] = useState<"board" | "parlay">("board");

  const games = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return weekThreeForecasts;
    return weekThreeForecasts.filter((game) => `${game.away} ${game.home} ${game.pick}`.toLowerCase().includes(q));
  }, [query]);

  const selectedProbability = coverProbability(selected.fairMargin, line);
  const jointProbability = legs.reduce((value, leg) => value * (leg.probability / 100), 1) * 100;
  const fairPayout = jointProbability > 0 ? 100 / (jointProbability / 100) : 0;

  const chooseGame = (game: GameDNAForecast) => {
    setSelected(game);
    setLine(-Math.max(1.5, Math.round((game.fairMargin * 0.6) * 2) / 2));
    setView("board");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addLeg = (game = selected, chosenLine = line) => {
    const probability = coverProbability(game.fairMargin, chosenLine);
    setLegs((current) => [
      ...current.filter((leg) => leg.game.id !== game.id),
      { game, line: chosenLine, probability },
    ]);
  };

  const runAssistant = () => {
    const prompt = assistant.trim();
    if (!prompt) return;
    const match = prompt.match(/(\d{1,2})\s*[- ]?leg/i);
    const requested = Math.min(match ? Number(match[1]) : 3, weekThreeForecasts.length);
    const asksParlay = /parlay|legs?|teams?|picks?/i.test(prompt);
    const matchingGame = weekThreeForecasts.find((game) =>
      `${game.away} ${game.home}`.toLowerCase().split(" ").some((word) => word.length > 4 && prompt.toLowerCase().includes(word))
    );

    if (matchingGame && !asksParlay) {
      chooseGame(matchingGame);
      setAssistantReply(`${matchingGame.pick} is Game DNA's call at ${pct(matchingGame.winProbability)}, with a fair margin of ${matchingGame.fairMargin}.`);
      return;
    }

    const built = [...weekThreeForecasts]
      .sort((a, b) => b.winProbability - a.winProbability)
      .slice(0, requested)
      .map((game) => {
        const saferLine = -Math.max(1.5, Math.round((game.fairMargin * 0.45) * 2) / 2);
        return { game, line: saferLine, probability: coverProbability(game.fairMargin, saferLine) };
      });
    setLegs(built);
    setView("parlay");
    setAssistantReply(`Built a ${built.length}-leg cushion-first draft from Game DNA's strongest calls. Exact ${book} prices are added only when the book feed is present.`);
  };

  return (
    <main className="min-h-screen bg-[#07110e] text-[#f5f7f4]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07110e]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3 lg:px-8">
          <button onClick={() => setView("board")} className="flex items-center gap-3 text-left">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#b9f227] text-[#07110e]"><Dna size={23} /></span>
            <span><strong className="block text-lg leading-none">GAME DNA</strong><small className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fa69d]">The forecast comes first</small></span>
          </button>
          <nav className="ml-5 hidden items-center gap-1 md:flex">
            <button onClick={() => setView("board")} className={`rounded-lg px-4 py-2 text-sm font-bold ${view === "board" ? "bg-white/10 text-white" : "text-[#8fa69d]"}`}>Game Board</button>
            <button onClick={() => setView("parlay")} className={`rounded-lg px-4 py-2 text-sm font-bold ${view === "parlay" ? "bg-white/10 text-white" : "text-[#8fa69d]"}`}>Parlay Lab</button>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <label className="hidden text-[10px] font-bold uppercase tracking-widest text-[#789087] sm:block">Price view</label>
            <div className="relative">
              <select value={book} onChange={(event) => setBook(event.target.value)} className="appearance-none rounded-xl border border-white/10 bg-[#101d18] py-2 pl-3 pr-9 text-sm font-bold outline-none">
                <option>FanDuel</option><option>DraftKings</option><option>BetMGM</option><option>Caesars</option><option>Market average</option><option>Manual entry</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 text-[#8fa69d]" size={16} />
            </div>
            <button onClick={() => setView("parlay")} className="relative grid h-10 w-10 place-items-center rounded-xl bg-[#b9f227] text-[#07110e]">
              <Ticket size={18} />{legs.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-black">{legs.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <section className="border-b border-white/10 bg-[#0b1713]">
        <div className="mx-auto max-w-[1500px] px-4 py-5 lg:px-8">
          <div className="flex items-start gap-3">
            <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#b9f227]/30 bg-[#b9f227]/10 text-[#b9f227]"><Bot size={19} /></span>
            <div className="w-full">
              <form onSubmit={(event) => { event.preventDefault(); runAssistant(); }} className="flex gap-2">
                <input value={assistant} onChange={(event) => setAssistant(event.target.value)} placeholder='Ask “Show me Buffalo” or “Build me a safer 13-leg parlay”' className="h-11 w-full rounded-xl border border-white/10 bg-[#07110e] px-4 text-sm outline-none transition focus:border-[#b9f227]/60" />
                <button className="flex h-11 items-center gap-2 rounded-xl bg-[#b9f227] px-5 text-sm font-black text-[#07110e]">Ask <Sparkles size={16} /></button>
              </form>
              <p className="mt-2 text-xs text-[#8fa69d]">{assistantReply}</p>
            </div>
          </div>
        </div>
      </section>

      {view === "board" ? (
        <div className="mx-auto max-w-[1500px] space-y-8 px-4 py-7 lg:px-8">
          <section className="grid gap-5 xl:grid-cols-[1.45fr_.8fr]">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b16]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
                <div><span className="text-[10px] font-black uppercase tracking-[.2em] text-[#b9f227]">Selected matchup</span><h1 className="mt-1 text-2xl font-black md:text-3xl">{selected.away} <span className="text-[#667c73]">@</span> {selected.home}</h1></div>
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-200">Late research snapshot</span>
              </div>
              <div className="grid gap-px bg-white/10 sm:grid-cols-3">
                <Metric label="Game DNA winner" value={selected.pick} sub={`${pct(selected.winProbability)} win probability`} accent />
                <Metric label="Game DNA spread" value={`${shortTeam(selected.pick)} -${selected.fairMargin.toFixed(1)}`} sub="Independent fair margin" />
                <Metric label="Game DNA total" value={selected.fairTotal.toFixed(1)} sub="Independent fair total" />
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between"><div><h2 className="font-black">Alternate Line Lab</h2><p className="text-xs text-[#8fa69d]">Move the line. The Game DNA forecast stays fixed.</p></div><SlidersHorizontal className="text-[#b9f227]" size={20} /></div>
                <input aria-label="Alternate spread" type="range" min="-14.5" max="7.5" step="1" value={line} onChange={(event) => setLine(Number(event.target.value))} className="w-full accent-[#b9f227]" />
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <MiniMetric label="Your line" value={`${shortTeam(selected.pick)} ${signed(line)}`} />
                  <MiniMetric label="Hit probability" value={pct(selectedProbability)} green />
                  <MiniMetric label="Game DNA fair price" value={String(fairAmerican(selectedProbability))} />
                  <button onClick={() => addLeg()} className="rounded-xl bg-[#b9f227] px-4 py-3 text-left text-[#07110e] transition hover:brightness-110"><span className="block text-[10px] font-black uppercase tracking-wider opacity-60">Parlay Lab</span><strong className="flex items-center justify-between">Add this leg <ArrowRight size={16} /></strong></button>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-white/10 bg-[#0d1b16] p-5">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-[#b9f227]"><ShieldCheck size={21} /></span><div><h2 className="font-black">Two separate layers</h2><p className="text-xs text-[#8fa69d]">No market input changes the call.</p></div></div>
              <div className="mt-5 space-y-3">
                <Layer number="1" title="Game DNA forecast" copy="Winner, score distribution, margin and total from sport data." />
                <Layer number="2" title={`${book} price`} copy="The selected book supplies only the line and payout used to evaluate the purchase." />
              </div>
              <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-black/10 p-4"><p className="text-xs leading-5 text-[#8fa69d]">The existing Odds API connection remains useful for book-specific menus and prices. Game DNA continues working when a book has not posted yet, and manual entry always remains available.</p></div>
            </aside>
          </section>

          <section>
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#b9f227]">NFL · Week 3</p><h2 className="text-2xl font-black">Every game. One independent call.</h2></div>
              <label className="relative block sm:w-80"><Search className="absolute left-3 top-3 text-[#71857e]" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a team or matchup" className="h-11 w-full rounded-xl border border-white/10 bg-[#0d1b16] pl-10 pr-4 text-sm outline-none focus:border-[#b9f227]/60" /></label>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {games.map((game) => <GameCard key={game.id} game={game} onOpen={() => chooseGame(game)} onQuickAdd={() => { const safe = -Math.max(1.5, Math.round(game.fairMargin * .5 * 2) / 2); addLeg(game, safe); }} />)}
            </div>
          </section>
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-7 lg:grid-cols-[1fr_380px] lg:px-8">
          <section>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#b9f227]">Parlay Lab</p>
            <div className="mt-1 flex items-end justify-between"><div><h1 className="text-3xl font-black">Cushion-first builder</h1><p className="mt-1 text-sm text-[#8fa69d]">Buy lines down, see the probability change, then compare the exact payout.</p></div><button onClick={() => setLegs([])} className="flex items-center gap-2 text-xs font-bold text-[#8fa69d]"><Trash2 size={15} /> Clear</button></div>
            {legs.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-[#0d1b16] p-12 text-center"><Ticket className="mx-auto text-[#b9f227]" /><h2 className="mt-3 font-black">Your parlay is empty</h2><p className="mt-1 text-sm text-[#8fa69d]">Ask the assistant to build one or add a leg from any game.</p><button onClick={() => setView("board")} className="mt-5 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold">Browse games</button></div> : <div className="mt-6 space-y-3">{legs.map((leg, index) => <ParlayRow key={leg.game.id} index={index + 1} leg={leg} onChange={(newLine) => setLegs((current) => current.map((item) => item.game.id === leg.game.id ? { ...item, line: newLine, probability: coverProbability(item.game.fairMargin, newLine) } : item))} onRemove={() => setLegs((current) => current.filter((item) => item.game.id !== leg.game.id))} />)}</div>}
          </section>
          <aside className="h-fit rounded-2xl border border-white/10 bg-[#0d1b16] p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between"><h2 className="font-black">Ticket DNA</h2><span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold">{legs.length} legs</span></div>
            <div className="mt-5 grid grid-cols-2 gap-3"><MiniMetric label="Joint probability" value={legs.length ? pct(jointProbability) : "—"} green /><MiniMetric label="Fair decimal payout" value={legs.length ? `${fairPayout.toFixed(2)}×` : "—"} /></div>
            <div className="mt-3 rounded-xl border border-white/10 bg-black/10 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-[#8fa69d]">Price comparison</p><p className="mt-2 text-sm">Waiting for the selected <strong>{book}</strong> ticket price.</p><p className="mt-1 text-xs leading-5 text-[#71857e]">This first calculation combines different games. Same-game legs will require the registered correlation model before Game DNA labels their joint probability.</p></div>
            <button disabled={!legs.length} className="mt-4 w-full rounded-xl bg-[#b9f227] py-3 text-sm font-black text-[#07110e] disabled:cursor-not-allowed disabled:opacity-30">Compare exact {book} payout</button>
          </aside>
        </div>
      )}
    </main>
  );
}

function Metric({ label, value, sub, accent = false }: { label: string; value: string; sub: string; accent?: boolean }) {
  return <div className="bg-[#0d1b16] p-5"><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#789087]">{label}</p><p className={`mt-2 text-xl font-black ${accent ? "text-[#b9f227]" : "text-white"}`}>{value}</p><p className="mt-1 text-xs text-[#789087]">{sub}</p></div>;
}

function MiniMetric({ label, value, green = false }: { label: string; value: string; green?: boolean }) {
  return <div className="rounded-xl border border-white/10 bg-black/10 p-3"><p className="text-[9px] font-black uppercase tracking-wider text-[#71857e]">{label}</p><p className={`mt-1 text-lg font-black ${green ? "text-[#b9f227]" : "text-white"}`}>{value}</p></div>;
}

function Layer({ number, title, copy }: { number: string; title: string; copy: string }) {
  return <div className="flex gap-3 rounded-xl border border-white/10 p-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#b9f227] text-xs font-black text-[#07110e]">{number}</span><div><strong className="text-sm">{title}</strong><p className="mt-1 text-xs leading-5 text-[#789087]">{copy}</p></div></div>;
}

function GameCard({ game, onOpen, onQuickAdd }: { game: GameDNAForecast; onOpen: () => void; onQuickAdd: () => void }) {
  return <article className="group rounded-2xl border border-white/10 bg-[#0d1b16] p-4 transition hover:-translate-y-0.5 hover:border-[#b9f227]/35">
    <button onClick={onOpen} className="w-full text-left">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#71857e]"><span>{game.kickoff}</span><span>{game.sport}</span></div>
      <div className="mt-3 flex items-center justify-between gap-3"><div><p className="text-sm text-[#8fa69d]">{game.away} @</p><p className="font-black">{game.home}</p></div><ArrowRight className="text-[#71857e] transition group-hover:translate-x-1 group-hover:text-[#b9f227]" size={18} /></div>
      <div className="mt-4 grid grid-cols-3 gap-2"><MiniMetric label="Pick" value={shortTeam(game.pick)} green /><MiniMetric label="Win" value={`${game.winProbability.toFixed(0)}%`} /><MiniMetric label="Fair" value={`-${game.fairMargin}`} /></div>
    </button>
    <button onClick={onQuickAdd} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-xs font-black text-[#a9b9b2] hover:border-[#b9f227]/40 hover:text-[#b9f227]"><Target size={14} /> Add a safer line</button>
  </article>;
}

function ParlayRow({ leg, index, onChange, onRemove }: { leg: ParlayLeg; index: number; onChange: (line: number) => void; onRemove: () => void }) {
  return <div className="rounded-2xl border border-white/10 bg-[#0d1b16] p-4"><div className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-xs font-black">{index}</span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><p className="font-black">{leg.game.pick} {signed(leg.line)}</p><p className="text-xs text-[#789087]">vs {leg.game.opponent} · fair margin {leg.game.fairMargin}</p></div><button onClick={onRemove} aria-label="Remove leg" className="text-[#71857e] hover:text-red-300"><X size={17} /></button></div><div className="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_110px_110px]"><input aria-label={`Line for ${leg.game.pick}`} type="range" min="-14.5" max="7.5" step="1" value={leg.line} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-[#b9f227]" /><MiniMetric label="Hit probability" value={pct(leg.probability)} green /><MiniMetric label="Fair price" value={String(fairAmerican(leg.probability))} /></div></div></div></div>;
}
