import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";

interface NumberPickerProps {
  selectedNumbers: number[];
  onSelect: (num: number) => void;
  onRemove: (num: number) => void;
  maxNumber: number;
  count?: number;
  label?: string;
}

export function NumberPicker({
  selectedNumbers,
  onSelect,
  onRemove,
  maxNumber,
  count,
  label = "Select Numbers",
}: NumberPickerProps) {
  const [inputValue, setInputValue] = useState("");
  const isComplete = count ? selectedNumbers.length === count : false;
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleSingleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= maxNumber && !selectedNumbers.includes(num)) {
      onSelect(num);
      setInputValue("");
    }
  };

  const handleIndexedChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = parseInt(value);

    // if empty, do nothing (user can clear)
    if (value === "") return;

    if (!isNaN(num) && num >= 1 && num <= maxNumber && !selectedNumbers.includes(num)) {
      onSelect(num);
      // clear this input after selection
      const input = inputsRef.current[idx];
      if (input) input.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base sm:text-lg">{label}</h3>
        {count && (
          <span className={`text-sm font-medium ${isComplete ? "text-accent" : "text-muted-foreground"}`}>
            {selectedNumbers.length}/{count}
          </span>
        )}
      </div>

      {/* Number Inputs with up/down arrows - Show first */}
      {count ? (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {Array.from({ length: count }).map((_, i) => (
            <Input
              key={i}
              type="number"
              min={1}
              max={maxNumber}
              onChange={(e) => handleIndexedChange(i, e)}
              placeholder=""
              className="h-12 sm:h-14 w-16 sm:w-20 text-center text-base font-semibold rounded-xl"
              ref={(el) => (inputsRef.current[i] = el)}
              disabled={selectedNumbers.length >= (count || 0) && !selectedNumbers[i]}
            />
          ))}
        </div>
      ) : (
        (!count || selectedNumbers.length < (count || 999)) && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={maxNumber}
              value={inputValue}
              onChange={handleSingleInputChange}
              placeholder={`Enter number (1-${maxNumber})`}
              className="h-12 text-base"
            />
          </div>
        )
      )}

      {/* Selected Numbers as Horizontal Boxes - Show after inputs */}
      {selectedNumbers.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center pt-2">
          <span className="text-sm text-muted-foreground mr-2">Selected:</span>
          {selectedNumbers.map((num, idx) => (
            <button
              key={num}
              onClick={() => onRemove(num)}
              className={`h-10 sm:h-12 px-4 sm:px-5 rounded-lg border-2 text-sm sm:text-base font-semibold transition-all ${
                idx === selectedNumbers.length - 1
                  ? "border-gold bg-gold/10 text-foreground hover:bg-gold/20"
                  : "border-muted-foreground/30 bg-background text-foreground hover:border-muted-foreground/50"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {count && selectedNumbers.length === count && (
        <div className="flex items-center gap-2 text-sm text-accent">
          <div className="h-2 w-2 rounded-full bg-accent" />
          Selection complete!
        </div>
      )}
    </div>
  );
}
