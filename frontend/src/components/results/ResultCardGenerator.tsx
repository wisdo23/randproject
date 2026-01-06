import { ResultCardDesign9 } from "@/components/results/ResultCardDesign9";
import type { DrawResult } from "@/types/lottery";

interface ResultCardGeneratorProps {
	result: DrawResult;
	className?: string;
}

export function ResultCardGenerator({ result, className }: ResultCardGeneratorProps) {
	if (!result) {
		return null;
	}

	return (
		<div id={`result-card-${result.id}`} className={className}>
			<ResultCardDesign9 result={result} />
		</div>
	);
}
