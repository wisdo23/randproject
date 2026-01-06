import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface GameOption {
  id: string;
  name: string;
  description?: string | null;
}

interface GameSelectProps {
  games: GameOption[];
  value?: string;
  loading?: boolean;
  placeholder?: string;
  onSelect: (id: string) => void;
}

export function GameSelect({ games, value, loading, placeholder = "Select a game...", onSelect }: GameSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredGames = useMemo(() => {
    if (!search.trim()) {
      return games;
    }
    const term = search.toLowerCase();
    return games.filter(game => {
      const nameMatch = game.name.toLowerCase().includes(term);
      const descMatch = game.description?.toLowerCase().includes(term);
      return nameMatch || descMatch;
    });
  }, [games, search]);

  const selectedLabel = useMemo(() => {
    const found = games.find(game => game.id === value);
    if (!found) return placeholder;
    return found.description ? `${found.name} – ${found.description}` : found.name;
  }, [games, value, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={loading || games.length === 0}
          className={cn("w-full justify-between text-left font-normal", !value && "text-muted-foreground")}
        >
          <span className="truncate">{selectedLabel}</span>
          <span className="ml-2 text-xs text-muted-foreground">Press / to search</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search games..."
            value={search}
            onValueChange={setSearch}
            autoFocus
          />
          <CommandList>
            <CommandEmpty>No game found.</CommandEmpty>
            <CommandGroup heading="Games">
              {filteredGames.map(game => (
                <CommandItem
                  key={game.id}
                  value={game.id}
                  onSelect={() => {
                    onSelect(game.id);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{game.name}</span>
                    {game.description && (
                      <span className="text-xs text-muted-foreground">{game.description}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
