"use client";

import { ArrowUpRight, Mail, Phone, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { PipelineBoardData, PipelineBoardStatus } from "../lib/admin-data";

type ColumnUi = {
  status: PipelineBoardStatus;
  title: string;
  dotClass: string;
  borderClass: string;
};

const columnUi: ColumnUi[] = [
  { status: "new", title: "New Inquiry", dotClass: "bg-sky-500", borderClass: "border-sky-500" },
  { status: "site_visit_scheduled", title: "Site Visit Scheduled", dotClass: "bg-amber-400", borderClass: "border-amber-400" },
  { status: "quote_sent", title: "Proposal Sent", dotClass: "bg-purple-400", borderClass: "border-purple-400" },
  { status: "negotiation", title: "Negotiation", dotClass: "bg-emerald-500", borderClass: "border-emerald-500" },
  { status: "won", title: "Closed - Won", dotClass: "bg-emerald-600", borderClass: "border-emerald-600" },
];

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function totalPipelineValue(board: PipelineBoardData) {
  return columnUi.reduce((sum, column) => sum + board.columns[column.status].totalValue, 0);
}

export function PipelineBoard({ initialBoard }: { initialBoard: PipelineBoardData }) {
  const [board, setBoard] = useState(initialBoard);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const pipelineValue = useMemo(() => totalPipelineValue(board), [board]);
  const allCards = useMemo(() => columnUi.flatMap((column) => board.columns[column.status].cards), [board]);
  const selectedLead = useMemo(
    () => allCards.find((card) => card.id === selectedLeadId) ?? null,
    [allCards, selectedLeadId],
  );

  const statusLabel = (status: PipelineBoardStatus) =>
    status
      .split("_")
      .map((chunk) => chunk[0].toUpperCase() + chunk.slice(1))
      .join(" ");

  const moveCard = async (leadId: number, targetStatus: PipelineBoardStatus) => {
    let fromStatus: PipelineBoardStatus | null = null;
    let movedCard: (typeof board.columns.new.cards)[number] | null = null;

    for (const column of columnUi) {
      const card = board.columns[column.status].cards.find((item) => item.id === leadId);
      if (card) {
        fromStatus = column.status;
        movedCard = card;
        break;
      }
    }

    if (!fromStatus || !movedCard || fromStatus === targetStatus) return;

    const previous = board;
    const next: PipelineBoardData = {
      ...board,
      columns: {
        ...board.columns,
        [fromStatus]: {
          ...board.columns[fromStatus],
          cards: board.columns[fromStatus].cards.filter((card) => card.id !== leadId),
          count: Math.max(0, board.columns[fromStatus].count - 1),
          totalValue: Math.max(0, board.columns[fromStatus].totalValue - movedCard.budget),
        },
        [targetStatus]: {
          ...board.columns[targetStatus],
          cards: [movedCard, ...board.columns[targetStatus].cards],
          count: board.columns[targetStatus].count + 1,
          totalValue: board.columns[targetStatus].totalValue + movedCard.budget,
        },
      },
    };

    setBoard(next);
    setSaveError(null);
    if (selectedLeadId === leadId) {
      setSelectedLeadId(leadId);
    }

    try {
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
      if (!response.ok) throw new Error("Status update failed.");
    } catch (error) {
      setBoard(previous);
      setSaveError(error instanceof Error ? error.message : "Could not update lead status.");
    }
  };

  return (
    <section className="relative flex flex-col">
      <div className="mb-6 border-b border-border/60 pb-4">
        <h1 className="mb-2 font-headings text-3xl font-bold tracking-tight">Sales Pipeline</h1>
        <p className="max-w-xl text-sm text-muted-foreground">Track every opportunity from first inquiry to signed contract.</p>
      </div>

      <div className="mb-6 flex items-center justify-end">
        <div className="flex min-w-[140px] flex-col items-end">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pipeline Value</span>
          <span className="font-headings text-lg font-bold">{currencyFormat.format(pipelineValue)}</span>
        </div>
      </div>

      {saveError ? <p className="mb-4 text-sm text-red-600">{saveError}</p> : null}

      <div className="overflow-x-auto overflow-y-hidden">
        <div className="flex min-w-max gap-6 pb-8">
          {columnUi.map((column) => (
            <section
              key={column.status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const leadId = Number(event.dataTransfer.getData("text/lead-id"));
                if (Number.isFinite(leadId)) {
                  void moveCard(leadId, column.status);
                }
              }}
              className="flex max-h-[calc(100vh-260px)] w-[320px] shrink-0 flex-col"
            >
              <header className={`sticky top-0 z-20 mb-3 rounded-t-xl border-x border-t-4 border-border/50 bg-background/80 p-3 shadow-sm backdrop-blur ${column.borderClass}`}>
                <div className="mb-1 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                    <span className={`h-2 w-2 rounded-full ${column.dotClass}`} />
                    {column.title}
                  </h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                    {board.columns[column.status].count}
                  </span>
                </div>
                <p className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Total Value:</span>
                  <span className="font-semibold">{currencyFormat.format(board.columns[column.status].totalValue)}</span>
                </p>
              </header>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-b-xl border-x border-b border-border/50 bg-muted/30 p-3">
                {board.columns[column.status].cards.map((card) => (
                  <article
                    key={card.id}
                    draggable
                    onDragStart={(event) => {
                      setDraggingId(card.id);
                      event.dataTransfer.setData("text/lead-id", String(card.id));
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    className={`group cursor-grab rounded-[12px] border border-border bg-background p-4 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:border-primary/50 ${
                      draggingId === card.id ? "opacity-60" : ""
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="pr-8 font-headings text-base font-bold">{card.client}</h3>
                      {card.heat ? <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">{card.heat}</span> : null}
                    </div>
                    <div className="mb-3 inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-800">
                      {card.service}
                    </div>
                    <div className="flex items-center justify-between border-t border-border/50 pt-4">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-semibold">{currencyFormat.format(card.budget)}</span>
                        <span className="text-muted-foreground">{card.ageLabel}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-70">
                        <button type="button" className="rounded p-1 hover:bg-muted" aria-label={`Call ${card.client}`}>
                          <Phone className="size-3.5" aria-hidden />
                        </button>
                        <button type="button" className="rounded p-1 hover:bg-muted" aria-label={`Email ${card.client}`}>
                          <Mail className="size-3.5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedLeadId(card.id)}
                          className="rounded p-1 hover:bg-muted"
                          aria-label={`View details for ${card.client}`}
                        >
                          <ArrowUpRight className="size-3.5" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {selectedLead ? (
        <div className="absolute inset-0 z-20 flex">
          <button
            type="button"
            onClick={() => setSelectedLeadId(null)}
            className="h-full flex-1 bg-black/30 backdrop-blur-[1px]"
            aria-label="Close lead details"
          />
          <aside className="h-full w-full max-w-[420px] border-l border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lead Details</p>
                <h2 className="font-headings text-2xl font-bold">{selectedLead.client}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadId(null)}
                className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground"
                aria-label="Close panel"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="space-y-5 p-4">
              <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service Requested</p>
                  <p className="font-semibold">{selectedLead.service}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                  <p className="font-semibold">{statusLabel(selectedLead.status)}</p>
                </div>
              </div>

              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-border p-2">
                    <Phone className="size-4 text-muted-foreground" aria-hidden />
                  </div>
                  <p className="font-semibold">{selectedLead.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-border p-2">
                    <Mail className="size-4 text-muted-foreground" aria-hidden />
                  </div>
                  <p className="font-semibold">{selectedLead.email}</p>
                </div>
              </div>

              <div className="space-y-2 border-b border-border pb-4">
                <p className="text-4xl font-bold tracking-tight">{currencyFormat.format(selectedLead.budget)}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Added {new Date(selectedLead.createdAt).toLocaleDateString()} · {selectedLead.ageLabel} ago
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => void moveCard(selectedLead.id, "quote_sent")}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  Mark as Proposal Sent
                </button>
                <button
                  type="button"
                  onClick={() => void moveCard(selectedLead.id, "site_visit_scheduled")}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  Book Site Visit
                </button>
                <button
                  type="button"
                  onClick={() => void moveCard(selectedLead.id, "won")}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Mark as Won
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
