import { ResultCardDesign9 } from "@/components/results/ResultCardDesign9";
import { DrawResult } from "@/types/lottery";
import { Card } from "@/components/ui/card";

const mockResult: DrawResult = {
  id: "123",
  gameId: "1",
  gameName: "Rand Lotto",
  drawDate: new Date(),
  drawTime: new Date().toLocaleTimeString(),
  winningNumbers: [12, 23, 34, 41, 7],
  machineNumbers: [9, 16, 28, 33, 45],
  shareCopy: "Rand Lotto draw results are out! Winning numbers: 12, 23, 34, 41, 7. Bonus: 9, 16, 28, 33, 45.",
  shareHashtags: ["RandLottery", "RandLotto"],
  shareTargets: ["facebook", "instagram", "twitter", "whatsapp"],
  status: "approved",
  isVerified: true,
  verifiedAt: new Date(),
  approvals: [],
  createdAt: new Date(),
};

export default function Design9DemoPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Design 9 Demo</h1>
        <p className="text-muted-foreground mt-1">Preview of the Result Card Design 9</p>
      </div>
      <Card className="p-4">
        <ResultCardDesign9 result={mockResult} />
      </Card>
    </div>
  );
}
