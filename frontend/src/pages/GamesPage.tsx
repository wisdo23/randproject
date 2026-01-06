import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Gamepad2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { api, ApiGame } from "@/lib/api";
import { getGameImage } from "@/lib/gameAssets";

type UiGame = {
  id: string;
  name: string;
  description?: string | null;
};

export default function GamesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGame, setNewGame] = useState({
    name: "",
    description: "",
  });

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: api.getGames,
  });

  const createGame = useMutation({
    mutationFn: api.createGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      setIsAddDialogOpen(false);
      setNewGame({ name: "", description: "" });
      toast({ title: "Game added", description: "Game created successfully." });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to add game", description: err.message, variant: "destructive" });
    },
  });

  const uiGames: UiGame[] = useMemo(
    () => games.map((g: ApiGame) => ({ id: String(g.id), name: g.name, description: g.description })),
    [games]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            Manage Games
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage lottery games and their draw schedules
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-5 w-5" />
              Add New Game
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Game</DialogTitle>
              <DialogDescription>
                Create a new lottery game with draw settings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Game Name</label>
                <Input
                  placeholder="e.g., PowerBall Plus"
                  value={newGame.name}
                  onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="e.g., Pick 6 numbers from 1-52"
                  value={newGame.description}
                  onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => createGame.mutate({ name: newGame.name, description: newGame.description })}
                disabled={!newGame.name.trim() || createGame.isLoading}
              >
                {createGame.isLoading ? "Saving..." : "Create Game"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Games Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading games...</p>}
        {!isLoading && uiGames.map((game, idx) => (
          <Card
            key={game.id}
            className="hover:shadow-large hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getGameImage(game.name) ? (
                    <img 
                      src={getGameImage(game.name)!} 
                      alt={game.name} 
                      className="h-14 w-14 object-cover rounded-xl shadow-gold" 
                    />
                  ) : (
                    <div className="p-3 rounded-xl gradient-gold shadow-gold">
                      <Gamepad2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{game.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{game.description || "No description"}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Games are managed server-side. Use the form above to add new entries.
              </p>
              <div className="text-xs text-muted-foreground">ID: {game.id}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
