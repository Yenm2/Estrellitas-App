import React from 'react';
import { Star, Trophy, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { FeedbackSubmission, Teammate } from '../types';

interface StatsViewProps {
  history: FeedbackSubmission[];
  teammates: Teammate[];
}

export const StatsView: React.FC<StatsViewProps> = ({ history, teammates }) => {
  // Aggregate stats
  const totalSubmissions = history.length;
  const totalStars = history.reduce((sum, item) => sum + item.totalStars, 0);

  let totalOk = 0;
  let totalSupport = 0;

  // Teammate individual stats
  const memberStatsMap: Record<
    string,
    { name: string; stars: number; okCount: number; supportCount: number; count: number }
  > = {};

  // Initialize with current teammates
  teammates.forEach((t) => {
    memberStatsMap[t.name] = {
      name: t.name,
      stars: 0,
      okCount: 0,
      supportCount: 0,
      count: 0,
    };
  });

  history.forEach((sub) => {
    sub.ratings.forEach((r) => {
      if (!memberStatsMap[r.teammateName]) {
        memberStatsMap[r.teammateName] = {
          name: r.teammateName,
          stars: 0,
          okCount: 0,
          supportCount: 0,
          count: 0,
        };
      }
      memberStatsMap[r.teammateName].stars += r.stars;
      memberStatsMap[r.teammateName].count += 1;

      const isOk = r.statusId === 'ok' || r.statusTag === '[OK]' || r.moodEmoji === '☀️' || r.moodEmoji === 'terminal' || !r.statusId;
      const isSupport = r.statusId === 'apoyo' || r.statusId === 'bloqueado' || r.moodEmoji === '😔';

      if (isOk) {
        memberStatsMap[r.teammateName].okCount += 1;
        totalOk += 1;
      } else if (isSupport) {
        memberStatsMap[r.teammateName].supportCount += 1;
        totalSupport += 1;
      }
    });
  });

  const memberRankings = Object.values(memberStatsMap).sort((a, b) => b.stars - a.stars);
  const averageStarsPerDay = totalSubmissions > 0 ? (totalStars / totalSubmissions).toFixed(1) : '0';

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* High-level Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 font-sans">
            <span className="text-xs font-medium">Total Estrellas</span>
            <Star className="w-4 h-4 fill-current text-current" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalStars}</p>
          <p className="text-[11px] text-neutral-500 font-sans">acumuladas</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 font-sans">
            <span className="text-xs font-medium">Promedio</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{averageStarsPerDay}</p>
          <p className="text-[11px] text-neutral-500 font-sans">por sesión</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 font-sans">
            <span className="text-xs font-medium">[OK] Activos</span>
            <CheckCircle2 className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalOk}</p>
          <p className="text-[11px] text-neutral-500 font-sans">estados positivos</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 font-sans">
            <span className="text-xs font-medium">En Apoyo</span>
            <AlertCircle className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalSupport}</p>
          <p className="text-[11px] text-neutral-500 font-sans">con seguimiento</p>
        </div>
      </div>

      {/* Leaderboard / Ranking */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
          <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
            <Trophy className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            <span>Ranking por Estrellas</span>
          </div>
          <span className="text-xs text-neutral-500 font-sans">{memberRankings.length} integrantes</span>
        </div>

        <div className="space-y-2">
          {memberRankings.map((member, index) => {
            const maxStars = Math.max(...memberRankings.map((m) => m.stars), 1);
            const percentage = Math.round((member.stars / maxStars) * 100);
            const rankNum = String(index + 1).padStart(2, '0');

            return (
              <div
                key={member.name}
                className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800/80 space-y-2"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-neutral-400">
                      #{rankNum}
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {member.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-sans">
                      ([OK]: {member.okCount} | Apoyo: {member.supportCount})
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 font-bold px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current text-current" />
                    <span>{member.stars} ★</span>
                  </div>
                </div>

                {/* Minimalist Progress bar */}
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-neutral-900 dark:bg-neutral-100 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(percentage, member.stars > 0 ? 5 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

