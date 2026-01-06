export interface Game {
  id: string;
  name: string;
  description?: string | null;
  drawDays: string[];
  drawTime: string;
  numbersCount: number;
  maxNumber: number;
  hasMachineNumbers: boolean;
  machineNumbersCount?: number;
  maxMachineNumber?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface ResultApproval {
  id: string;
  managerId: string;
  decision: "approved" | "rejected";
  note?: string;
  createdAt: Date;
}

export interface DrawResult {
  id: string;
  gameId: string;
  gameName: string;
  drawDate: Date;
  drawTime: string;
  winningNumbers: number[];
  machineNumbers?: number[];
  shareCopy: string;
  shareHashtags: string[];
  shareTargets: string[];
  status: "pending_review" | "approved" | "changes_requested";
  isVerified: boolean;
  verifiedAt?: Date;
  approvals: ResultApproval[];
  createdAt: Date;
}

export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  isConnected: boolean;
}
