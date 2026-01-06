import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DrawResult } from "@/types/lottery";
import { ResultCard } from "@/components/results/ResultCard";
import { ResultCardGenerator } from "../components/results/ResultCardGenerator";
import { SocialSharePanel } from "@/components/results/SocialSharePanel";
import { Check, AlertCircle, ArrowRight, RotateCcw, Download } from "lucide-react";
import { generateResultImage, downloadImage } from "@/lib/imageGenerator";
import { useToast } from "@/hooks/use-toast";
import { api, ApiGame, ApiDraw, ApiResult } from "@/lib/api";
import { GameSelect } from "@/components/results/GameSelect";

type Step = "select" | "enter" | "verify" | "preview" | "share";

type UiGame = { 
  id: string; 
  name: string; 
  description?: string | null; 
  numbersCount: number; 
  maxNumber: number; 
  hasMachineNumbers: boolean; 
  machineNumbersCount?: number; 
  maxMachineNumber?: number;
};

export default function PostResultsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: games = [], isLoading: gamesLoading } = useQuery({ 
    queryKey: ["games"], 
    queryFn: api.getGames 
  });

  const createDraw = useMutation({ mutationFn: api.createDraw });
  const createResult = useMutation({ mutationFn: api.createResult });

  const [step, setStep] = useState<Step>("select");
  const [selectedGame, setSelectedGame] = useState<UiGame | null>(null);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [bonusNumbers, setBonusNumbers] = useState<string[]>([]);
  const [verificationNumbers, setVerificationNumbers] = useState<string[]>([]);
  const [verificationBonus, setVerificationBonus] = useState<string[]>([]);
  const [result, setResult] = useState<DrawResult | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const normalizeValue = (value: string) => {
    if (!value) {
      return null;
    }
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return null;
    }
    return String(parsed);
  };

  const hasDuplicates = (values: string[]) => {
    const normalized = values
      .map((value) => normalizeValue(value.trim()))
      .filter((value): value is string => value !== null);
    return new Set(normalized).size !== normalized.length;
  };

  const uiGames: UiGame[] = games.map((g: ApiGame) => ({
    id: String(g.id),
    name: g.name,
    description: g.description,
    numbersCount: 5,
    maxNumber: 36,
    hasMachineNumbers: true, // Enable machine numbers
    machineNumbersCount: 5, // Support 5 machine numbers like the Facebook example
    maxMachineNumber: 90,
  }));

  const handleGameSelect = (gameId: string) => {
    const game = uiGames.find(g => g.id === gameId);
    if (game) {
      setSelectedGame(game);
      setNumbers(Array(game.numbersCount).fill(""));
      setBonusNumbers(game.hasMachineNumbers ? Array(game.machineNumbersCount || 1).fill("") : []);
      setVerificationNumbers(Array(game.numbersCount).fill(""));
      setVerificationBonus(game.hasMachineNumbers ? Array(game.machineNumbersCount || 1).fill("") : []);
      setStep("enter");
    }
  };

  const handleNumberChange = (index: number, value: string, isBonus = false) => {
    const sanitized = value.trim();
    if (isBonus) {
      const newBonusNumbers = [...bonusNumbers];
      const normalizedValue = normalizeValue(sanitized);
      if (
        normalizedValue &&
        newBonusNumbers.some((num, idx) => idx !== index && normalizeValue(num) === normalizedValue)
      ) {
        toast({
          title: "Duplicate number",
          description: "Each machine number must be unique.",
          variant: "destructive",
        });
        return;
      }
      newBonusNumbers[index] = sanitized;
      setBonusNumbers(newBonusNumbers);
    } else {
      const newNumbers = [...numbers];
      const normalizedValue = normalizeValue(sanitized);
      if (
        normalizedValue &&
        newNumbers.some((num, idx) => idx !== index && normalizeValue(num) === normalizedValue)
      ) {
        toast({
          title: "Duplicate number",
          description: "Winning numbers cannot repeat.",
          variant: "destructive",
        });
        return;
      }
      newNumbers[index] = sanitized;
      setNumbers(newNumbers);
    }
  };

  const handleVerificationChange = (index: number, value: string, isBonus = false) => {
    const sanitized = value.trim();
    if (isBonus) {
      const newBonus = [...verificationBonus];
      const normalizedValue = normalizeValue(sanitized);
      if (
        normalizedValue &&
        newBonus.some((num, idx) => idx !== index && normalizeValue(num) === normalizedValue)
      ) {
        toast({
          title: "Duplicate number",
          description: "Each machine number must be unique.",
          variant: "destructive",
        });
        return;
      }
      newBonus[index] = sanitized;
      setVerificationBonus(newBonus);
    } else {
      const newNumbers = [...verificationNumbers];
      const normalizedValue = normalizeValue(sanitized);
      if (
        normalizedValue &&
        newNumbers.some((num, idx) => idx !== index && normalizeValue(num) === normalizedValue)
      ) {
        toast({
          title: "Duplicate number",
          description: "Winning numbers cannot repeat.",
          variant: "destructive",
        });
        return;
      }
      newNumbers[index] = sanitized;
      setVerificationNumbers(newNumbers);
    }
  };

  const validateEntry = () => {
    const allFilled = numbers.every(n => n !== "" && !isNaN(parseInt(n)));
    const bonusFilled = bonusNumbers.length === 0 || bonusNumbers.every(n => n !== "" && !isNaN(parseInt(n)));
    if (!allFilled || !bonusFilled) {
      return false;
    }
    if (hasDuplicates(numbers) || hasDuplicates(bonusNumbers)) {
      return false;
    }
    return true;
  };

  const handleVerify = async () => {
    if (hasDuplicates(numbers) || hasDuplicates(bonusNumbers)) {
      toast({
        title: "Duplicate numbers",
        description: "Winning and machine numbers must all be unique before verification.",
        variant: "destructive",
      });
      setStep("enter");
      return;
    }
    const numbersMatch = numbers.every((n, i) => n === verificationNumbers[i]);
    const bonusMatch = bonusNumbers.every((n, i) => n === verificationBonus[i]);

    if (!numbersMatch || !bonusMatch) {
      toast({
        title: "Verification Failed",
        description: "The entered numbers don't match. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedGame) return;

    try {
      const draw: ApiDraw = await createDraw.mutateAsync({
        game_id: Number(selectedGame.id),
        draw_datetime: new Date().toISOString(),
      });

      const winningNumbers = numbers.map(n => parseInt(n));
      const machineNumbers = bonusNumbers.length > 0 ? bonusNumbers.map(n => parseInt(n)) : undefined;

      const res: ApiResult = await createResult.mutateAsync({
        draw_id: draw.id,
        winning_numbers: winningNumbers,
        machine_numbers: machineNumbers,
      });

      const parseNumbers = (value?: string | null): number[] =>
        value
          ? value
              .split(",")
              .map((n) => Number(n.trim()))
              .filter((n) => Number.isFinite(n))
          : [];

      const drawDate = new Date(res.draw.draw_datetime);
      const allowedStatuses: DrawResult["status"][] = ["pending_review", "approved", "changes_requested"];
      const statusCandidate = res.status as DrawResult["status"];
      const status = allowedStatuses.includes(statusCandidate) ? statusCandidate : "pending_review";
      const parsedWinning = parseNumbers(res.winning_numbers);
      const parsedMachine = parseNumbers(res.machine_numbers);

      const newResult: DrawResult = {
        id: String(res.id),
        gameId: String(res.draw.game_id),
        gameName: res.draw.game?.name || selectedGame.name,
        drawDate,
        drawTime: drawDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        winningNumbers: parsedWinning.length ? parsedWinning : winningNumbers,
        machineNumbers: parsedMachine.length ? parsedMachine : undefined,
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
        createdAt: res.created_at ? new Date(res.created_at) : new Date(),
      };

      setResult(newResult);
      setStep("preview");
      toast({
        title: "Verification Successful!",
        description: "Numbers match. Proceed to preview and share.",
      });
      queryClient.invalidateQueries({ queryKey: ["results"] });
      queryClient.invalidateQueries({ queryKey: ["draws"] });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save result";
      toast({ 
        title: "Failed to save result", 
        description: message, 
        variant: "destructive" 
      });
    }
  };

  const handleDownloadImage = async () => {
    if (!result) return;
    
    try {
      const dataUrl = await generateResultImage(`result-card-${result.id}`);
      setGeneratedImage(dataUrl);
      downloadImage(dataUrl, `${result.gameName}-${new Date().toISOString().split('T')[0]}.png`);
      toast({
        title: "Image Downloaded",
        description: "Result card image saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not generate image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setStep("select");
    setSelectedGame(null);
    setNumbers([]);
    setBonusNumbers([]);
    setVerificationNumbers([]);
    setVerificationBonus([]);
    setResult(null);
    setGeneratedImage(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            Post Results
          </h1>
          <p className="text-muted-foreground mt-1">
            Enter, verify, and share draw results
          </p>
        </div>
        {step !== "select" && (
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 md:gap-4 py-4">
        {["select", "enter", "verify", "preview", "share"].map((s, idx) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step === s
                  ? "gradient-gold text-primary-foreground shadow-gold"
                  : idx < ["select", "enter", "verify", "preview", "share"].indexOf(step)
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {idx < ["select", "enter", "verify", "preview", "share"].indexOf(step) ? (
                <Check className="h-4 w-4" />
              ) : (
                idx + 1
              )}
            </div>
            {idx < 4 && (
              <div
                className={`w-8 md:w-16 h-0.5 mx-1 ${
                  idx < ["select", "enter", "verify", "preview", "share"].indexOf(step)
                    ? "bg-accent"
                    : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === "select" && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Select Game</CardTitle>
            <CardDescription>Choose the game to post results for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <GameSelect
              games={uiGames.map(game => ({ id: game.id, name: game.name, description: game.description }))}
              loading={gamesLoading}
              onSelect={handleGameSelect}
            />
          </CardContent>
        </Card>
      )}

      {step === "enter" && selectedGame && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Enter Winning Numbers</CardTitle>
            <CardDescription>
              Enter the {selectedGame.numbersCount} winning numbers for {selectedGame.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">
                Winning Numbers (1-{selectedGame.maxNumber})
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {numbers.map((num, idx) => (
                  <Input
                    key={idx}
                    type="number"
                    min={1}
                    max={selectedGame.maxNumber}
                    value={num}
                    onChange={(e) => handleNumberChange(idx, e.target.value)}
                    className="w-16 sm:w-20 h-12 sm:h-14 text-center text-base sm:text-xl font-bold rounded-xl"
                    placeholder=""
                  />
                ))}
              </div>
            </div>

            {selectedGame.hasMachineNumbers && (
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Machine Numbers / Last {selectedGame.machineNumbersCount} Numbers (1-{selectedGame.maxMachineNumber})
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {bonusNumbers.map((num, idx) => (
                    <Input
                      key={idx}
                      type="number"
                      min={1}
                      max={selectedGame.maxMachineNumber}
                      value={num}
                      onChange={(e) => handleNumberChange(idx, e.target.value, true)}
                      className="w-16 sm:w-20 h-12 sm:h-14 text-center text-base sm:text-xl font-bold rounded-xl border-orange-500 border-2"
                      placeholder=""
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  These are the additional numbers from the lottery machine
                </p>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={() => setStep("verify")}
              disabled={!validateEntry()}
            >
              Continue to Verification
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "verify" && selectedGame && (
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-gold" />
              <div>
                <CardTitle>Double Verification</CardTitle>
                <CardDescription>
                  Re-enter the numbers to confirm accuracy
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">
                Re-enter Winning Numbers
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {verificationNumbers.map((num, idx) => (
                  <Input
                    key={idx}
                    type="number"
                    min={1}
                    max={selectedGame.maxNumber}
                    value={num}
                    onChange={(e) => handleVerificationChange(idx, e.target.value)}
                    className="w-16 sm:w-20 h-12 sm:h-14 text-center text-base sm:text-xl font-bold rounded-xl"
                    placeholder=""
                  />
                ))}
              </div>
            </div>

            {selectedGame.hasMachineNumbers && (
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Re-enter Machine Numbers / Last {selectedGame.machineNumbersCount} Numbers
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {verificationBonus.map((num, idx) => (
                    <Input
                      key={idx}
                      type="number"
                      min={1}
                      max={selectedGame.maxMachineNumber}
                      value={num}
                      onChange={(e) => handleVerificationChange(idx, e.target.value, true)}
                      className="w-16 sm:w-20 h-12 sm:h-14 text-center text-base sm:text-xl font-bold rounded-xl border-orange-500 border-2"
                      placeholder=""
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("enter")} className="flex-1">
                Go Back
              </Button>
              <Button 
                size="lg" 
                className="flex-1" 
                onClick={handleVerify} 
                disabled={createDraw.isPending || createResult.isPending}
              >
                {createDraw.isPending || createResult.isPending ? "Saving..." : "Verify & Continue"}
                <Check className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "preview" && result && (
        <div className="space-y-6 animate-slide-up">
          <Card>
            <CardHeader>
              <CardTitle>Preview Result Card</CardTitle>
              <CardDescription>
                This is how the result will appear on social media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Beautiful Generated Card */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <ResultCardGenerator result={result} />
              </div>

              {/* Download Button */}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleDownloadImage}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Result Image
              </Button>

              {/* Original Card for comparison */}
              <div className="border-t pt-6">
                <p className="text-sm text-muted-foreground mb-4">Simple view:</p>
                <ResultCard result={result} />
              </div>
            </CardContent>
          </Card>

          <Button size="lg" className="w-full" onClick={() => setStep("share")}>
            Continue to Share
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      )}

      {step === "share" && result && (
        <div className="space-y-6 animate-slide-up">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ResultCardGenerator result={result} />
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleDownloadImage}
              >
                <Download className="h-5 w-5 mr-2" />
                Download for Social Media
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <SocialSharePanel result={result} cardElementId={`result-card-${result.id}`} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="p-4 rounded-xl bg-accent/10 inline-flex mb-4">
                <Check className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Ready to Post Manually
              </h3>
              <p className="text-muted-foreground mb-4">
                Use the copy and download tools above to post on each social platform while you are signed in.
              </p>
              <Button variant="dark" onClick={handleReset}>
                Post Another Result
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
