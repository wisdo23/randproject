import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockGames, mockResults } from "@/data/mockData";
import { Trophy, Gamepad2, Clock, TrendingUp, ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ResultCard } from "@/components/results/ResultCard";

export default function Dashboard() {
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const resultsToday = mockResults.filter(result => 
    format(result.drawDate, "yyyy-MM-dd") === todayKey
  ).length;
  const pendingReviews = mockResults.filter(result => result.status === "pending_review").length;
  const approvedToday = mockResults.filter(result => {
    if (!result.verifiedAt) {
      return false;
    }

    return format(result.verifiedAt, "yyyy-MM-dd") === todayKey;
  }).length;
  const stats = [
    {
      title: "Active Games",
      value: mockGames.filter(game => game.isActive).length,
      icon: Gamepad2,
      color: "text-primary",
    },
    {
      title: "Results Today",
      value: resultsToday,
      icon: Trophy,
      color: "text-accent",
    },
    {
      title: "Awaiting Review",
      value: pendingReviews,
      icon: Clock,
      color: "text-gold",
    },
    {
      title: "Approved Today",
      value: approvedToday,
      icon: TrendingUp,
      color: "text-emerald",
    },
  ];

  const latestResult = [...mockResults].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )[0];
  const upcomingDraws = mockGames.filter(g => g.isActive).slice(0, 3);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage lottery results and share to social media
          </p>
        </div>
        <Link to="/post-results">
          <Button size="lg" className="w-full md:w-auto">
            <Plus className="h-5 w-5" />
            Post New Results
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card 
            key={stat.title} 
            className="hover:shadow-large hover:-translate-y-1 cursor-default animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {stat.title}
                  </p>
                  <p className="font-display text-2xl md:text-3xl font-bold mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 md:p-3 rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Latest Result */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Latest Result</h2>
            <Link to="/history">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          {latestResult && <ResultCard result={latestResult} />}
        </div>

        {/* Upcoming Draws */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Active Games</h2>
            <Link to="/games">
              <Button variant="ghost" size="sm">
                Manage <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingDraws.map((game, idx) => (
              <Card 
                key={game.id} 
                className="hover:shadow-large hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl gradient-gold shadow-gold">
                      <Gamepad2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{game.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {game.drawDays.join(", ")} • {game.drawTime}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                      Active
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/post-results">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="text-sm">Post Results</span>
              </Button>
            </Link>
            <Link to="/games">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Plus className="h-6 w-6 text-accent" />
                <span className="text-sm">Add Game</span>
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Clock className="h-6 w-6 text-gold" />
                <span className="text-sm">View History</span>
              </Button>
            </Link>
            <Link to="/post-results">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <TrendingUp className="h-6 w-6 text-emerald" />
                <span className="text-sm">Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
