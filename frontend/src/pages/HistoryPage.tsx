import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DrawResult } from "@/types/lottery";
import { ResultCard } from "@/components/results/ResultCard";
import { Search, Filter, Calendar, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, ApiGame, ApiDraw, ApiResult } from "@/lib/api";

export default function HistoryPage() {
  const { data: games = [], isLoading: gamesLoading } = useQuery({ queryKey: ["games"], queryFn: api.getGames });
  const { data: draws = [], isLoading: drawsLoading } = useQuery({ queryKey: ["draws"], queryFn: api.getDraws });
  const { data: results = [], isLoading: resultsLoading } = useQuery({ queryKey: ["results"], queryFn: api.getResults });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const uiResults: DrawResult[] = useMemo(() => {
    const parseNumbers = (value?: string | null): number[] =>
      value
        ? value
            .split(",")
            .map((n) => n.trim())
            .filter(Boolean)
            .map((n) => parseInt(n, 10))
        : [];

    const allowedStatuses: DrawResult["status"][] = ["pending_review", "approved", "changes_requested"];

    return results.map((res: ApiResult) => {
      const drawResponse = res.draw;
      const drawFallback = (draws as ApiDraw[]).find((d) => d.id === res.draw_id);
      const gameFallback = (games as ApiGame[]).find((g) => g.id === (drawFallback?.game_id ?? -1));

      const drawDate = drawResponse
        ? new Date(drawResponse.draw_datetime)
        : drawFallback
        ? new Date(drawFallback.draw_datetime)
        : new Date();

      const gameName = drawResponse?.game?.name || gameFallback?.name || "Unknown Game";
      const gameId = drawResponse?.game_id ?? drawFallback?.game_id ?? res.draw_id;

      const winningNumbers = parseNumbers(res.winning_numbers);
      const machineNumbers = parseNumbers(res.machine_numbers);
      const statusCandidate = res.status as DrawResult["status"];
      const status = allowedStatuses.includes(statusCandidate) ? statusCandidate : "pending_review";

      return {
        id: String(res.id),
        gameId: String(gameId),
        gameName,
        drawDate,
        drawTime: drawDate.toLocaleTimeString(),
        winningNumbers, 
        machineNumbers: machineNumbers.length ? machineNumbers : undefined,
        shareCopy: res.share_copy,
        shareHashtags: res.share_hashtags ?? [],
        shareTargets: res.share_targets ?? [],
        status,
        isVerified: res.verified,
        verifiedAt: res.verified_at ? new Date(res.verified_at) : undefined,
        approvals: res.approvals?.map((approval) => ({
          id: String(approval.id),
          managerId: String(approval.manager_id),
          decision: approval.decision === "approved" ? "approved" : "rejected",
          note: approval.note ?? undefined,
          createdAt: new Date(approval.created_at),
        })) ?? [],
        createdAt: res.created_at ? new Date(res.created_at) : drawDate,
      };
    });
  }, [results, draws, games]);

  const filteredResults = uiResults.filter((result) => {
    const matchesSearch = result.gameName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === "all" || result.gameId === selectedGame;
    const matchesDate = !dateFilter || format(result.drawDate, "yyyy-MM-dd") === dateFilter;
    return matchesSearch && matchesGame && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">
          Results History
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse and filter past lottery results
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by game name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedGame} onValueChange={setSelectedGame} disabled={gamesLoading}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                {(games as ApiGame[]).map((game) => (
                  <SelectItem key={game.id} value={String(game.id)}>
                    {game.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 w-full md:w-[180px]"
              />
            </div>
            {(searchQuery || selectedGame !== "all" || dateFilter) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGame("all");
                  setDateFilter("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Stats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredResults.length}</span> results
        </p>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Sort by Date
        </Button>
      </div>

      {/* Results Grid */}
      {resultsLoading || drawsLoading || gamesLoading ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">Loading results...</CardContent>
        </Card>
      ) : filteredResults.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((result, idx) => (
            <div
              key={result.id}
              className="animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <ResultCard result={result} />
              <div className="mt-3 space-y-1">
                <div className="text-xs text-muted-foreground">
                  Status: <span className="font-medium text-foreground capitalize">{result.status.replace(/_/g, " ")}</span>
                </div>
                {result.shareTargets.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
                    {result.shareTargets.map((target) => (
                      <span key={target} className="px-2 py-0.5 bg-muted rounded-full capitalize">
                        {target}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="p-4 rounded-xl bg-muted inline-flex mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">
              No Results Found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
