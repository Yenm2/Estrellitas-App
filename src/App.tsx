/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { TeammateCard } from './components/TeammateCard';
import { QuickPresetBar } from './components/QuickPresetBar';
import { FeedbackActionBar } from './components/FeedbackActionBar';
import { FeedbackHistoryView } from './components/FeedbackHistoryView';
import { StatsView } from './components/StatsView';
import { ManageTeamModal } from './components/ManageTeamModal';
import { InitialSetupModal } from './components/InitialSetupModal';
import { Teammate, TeammateRating, FeedbackSubmission, FormatStyle } from './types';
import {
  getStoredTeammates,
  saveStoredTeammates,
  getStoredHistory,
  saveStoredHistory,
  getStoredSoundPreference,
  saveStoredSoundPreference,
  getStoredTeamName,
  saveStoredTeamName,
  getIsSetupCompleted,
  getStoredFormatStyle,
  saveStoredFormatStyle,
  formatSingleLine,
  STATUS_OPTIONS,
} from './utils/storage';

// Initial default rating pattern matching prompt example
const INITIAL_PROMPT_PRESETS: Record<string, { statusId: string; statusTag: string; stars: number }> = {
  Anjel: { statusId: 'ok', statusTag: '[OK]', stars: 1 },
  David: { statusId: 'apoyo', statusTag: '[APOYO]', stars: 0 },
  Fer: { statusId: 'ok', statusTag: '[OK]', stars: 2 },
  Hector: { statusId: 'ok', statusTag: '[OK]', stars: 1 },
  Isaac: { statusId: 'ok', statusTag: '[OK]', stars: 1 },
  Lalo: { statusId: 'apoyo', statusTag: '[APOYO]', stars: 0 },
  Luis: { statusId: 'ok', statusTag: '[OK]', stars: 1 },
  Pablo: { statusId: 'apoyo', statusTag: '[APOYO]', stars: 0 },
  Rebeca: { statusId: 'ok', statusTag: '[OK]', stars: 1 },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'rate' | 'history' | 'stats'>('rate');
  const [teamName, setTeamName] = useState<string>(getStoredTeamName);
  const [teammates, setTeammates] = useState<Teammate[]>(getStoredTeammates);
  const [history, setHistory] = useState<FeedbackSubmission[]>(getStoredHistory);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(getStoredSoundPreference);
  const [formatStyle, setFormatStyle] = useState<FormatStyle>(getStoredFormatStyle);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(() => !getIsSetupCompleted());
  const [isCopied, setIsCopied] = useState(false);

  // Format Style Change Handler
  const handleFormatStyleChange = (newStyle: FormatStyle) => {
    setFormatStyle(newStyle);
    saveStoredFormatStyle(newStyle);
  };

  // Active Draft Ratings mapped by teammate ID
  const [ratingsMap, setRatingsMap] = useState<Record<string, TeammateRating>>(() => {
    const initialMap: Record<string, TeammateRating> = {};
    teammates.forEach((t) => {
      const preset = INITIAL_PROMPT_PRESETS[t.name] || { statusId: 'ok', statusTag: '[OK]', stars: 1 };
      initialMap[t.id] = {
        teammateId: t.id,
        teammateName: t.name,
        statusId: preset.statusId,
        statusTag: preset.statusTag,
        stars: preset.stars,
      };
    });
    return initialMap;
  });

  // Keep ratingsMap in sync when teammates change
  useEffect(() => {
    setRatingsMap((prev) => {
      const nextMap: Record<string, TeammateRating> = { ...prev };
      teammates.forEach((t) => {
        if (!nextMap[t.id]) {
          const preset = INITIAL_PROMPT_PRESETS[t.name] || { statusId: 'ok', statusTag: '[OK]', stars: 1 };
          nextMap[t.id] = {
            teammateId: t.id,
            teammateName: t.name,
            statusId: preset.statusId,
            statusTag: preset.statusTag,
            stars: preset.stars,
          };
        } else {
          // Ensure name stays synced
          nextMap[t.id].teammateName = t.name;
        }
      });
      return nextMap;
    });
  }, [teammates]);

  // Persist sound preference
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    saveStoredSoundPreference(next);
  };

  // Persist team name
  const handleSaveTeamName = (name: string) => {
    const trimmed = name.trim() || 'Mi Equipo';
    setTeamName(trimmed);
    saveStoredTeamName(trimmed);
  };

  // Persist teammates
  const handleSaveTeammates = (updated: Teammate[]) => {
    setTeammates(updated);
    saveStoredTeammates(updated);
  };

  // Complete setup flow
  const handleCompleteSetup = (newTeamName: string, newTeammates: Teammate[]) => {
    handleSaveTeamName(newTeamName);
    handleSaveTeammates(newTeammates);
    setIsSetupModalOpen(false);
  };

  // Update a single teammate rating
  const handleUpdateRating = (rating: TeammateRating) => {
    setRatingsMap((prev) => ({
      ...prev,
      [rating.teammateId]: rating,
    }));
  };

  // Quick preset: Set all to [OK]
  const handleSetAllOk = () => {
    setRatingsMap((prev) => {
      const next: Record<string, TeammateRating> = {};
      Object.keys(prev).forEach((id) => {
        next[id] = {
          ...prev[id],
          statusId: 'ok',
          statusTag: '[OK]',
        };
      });
      return next;
    });
  };

  // Quick preset: Add +1 star to all
  const handleAddStarToAll = () => {
    setRatingsMap((prev) => {
      const next: Record<string, TeammateRating> = {};
      Object.keys(prev).forEach((id) => {
        next[id] = {
          ...prev[id],
          stars: Math.min(5, (prev[id].stars || 0) + 1),
        };
      });
      return next;
    });
  };

  // Reset ratings to 0 stars and default [OK]
  const handleResetRatings = () => {
    setRatingsMap((prev) => {
      const next: Record<string, TeammateRating> = {};
      Object.keys(prev).forEach((id) => {
        next[id] = {
          ...prev[id],
          statusId: 'ok',
          statusTag: '[OK]',
          stars: 0,
          note: '',
        };
      });
      return next;
    });
  };

  // Filtered teammates based on search
  const filteredTeammates = useMemo(() => {
    if (!searchQuery.trim()) return teammates;
    const q = searchQuery.toLowerCase();
    return teammates.filter((t) => t.name.toLowerCase().includes(q));
  }, [teammates, searchQuery]);

  // Calculate live counts
  const { totalStars, okCount, needHelpCount } = useMemo(() => {
    let stars = 0;
    let oks = 0;
    let helps = 0;

    teammates.forEach((t) => {
      const r = ratingsMap[t.id];
      if (r) {
        stars += r.stars || 0;
        if (r.statusId === 'ok' || r.statusTag === '[OK]') oks += 1;
        if (r.statusId === 'apoyo' || r.statusId === 'bloqueado') helps += 1;
      }
    });

    return { totalStars: stars, okCount: oks, needHelpCount: helps };
  }, [teammates, ratingsMap]);

  // Format live preview text according to the selected formatStyle
  const previewText = useMemo(() => {
    const lines = teammates.map((t) => {
      const r = ratingsMap[t.id] || { statusId: 'ok', statusTag: '[OK]', stars: 0 };
      return formatSingleLine(t.name, r.statusTag || '[OK]', r.stars, r.note, formatStyle);
    });
    const header = teamName ? `Feedback: ${teamName}\n` : '';
    return `${header}${lines.join('\n')}`;
  }, [teamName, teammates, ratingsMap, formatStyle]);

  // Copy preview to clipboard
  const handleCopyPreview = () => {
    navigator.clipboard.writeText(previewText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Submit and save feedback
  const handleSendFeedback = (generalNote?: string) => {
    const currentRatings: TeammateRating[] = teammates.map((t) => {
      return (
        ratingsMap[t.id] || {
          teammateId: t.id,
          teammateName: t.name,
          statusId: 'ok',
          statusTag: '[OK]',
          stars: 0,
        }
      );
    });

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newSubmission: FeedbackSubmission = {
      id: `sub-${Date.now()}`,
      timestamp: Date.now(),
      dateString: dateFormatted,
      ratings: currentRatings,
      generalNote,
      totalStars,
      formatStyle,
    };

    const updatedHistory = [newSubmission, ...history];
    setHistory(updatedHistory);
    saveStoredHistory(updatedHistory);
  };

  // History operations
  const handleDeleteSubmission = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    saveStoredHistory(updated);
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    saveStoredHistory([]);
  };

  const handleLoadAsCurrentDraft = (submission: FeedbackSubmission) => {
    const nextMap: Record<string, TeammateRating> = { ...ratingsMap };
    submission.ratings.forEach((r) => {
      nextMap[r.teammateId] = {
        ...r,
        statusId: r.statusId || (r.statusTag === '[APOYO]' ? 'apoyo' : 'ok'),
        statusTag: r.statusTag || (r.statusId === 'apoyo' ? '[APOYO]' : '[OK]'),
      };
    });
    if (submission.formatStyle) {
      handleFormatStyleChange(submission.formatStyle);
    }
    setRatingsMap(nextMap);
    setActiveTab('rate');
  };

  return (
    <div className="min-h-screen bg-neutral-100/80 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-mono selection:bg-neutral-900 selection:text-white dark:selection:bg-neutral-100 dark:selection:text-neutral-900">
      {/* Top App Bar & Navigation */}
      <Navbar
        teamName={teamName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-4 md:p-6 pb-28">
        {/* Tab 1: Calificar (Rating Grid) */}
        {activeTab === 'rate' && (
          <div className="space-y-4">
            {/* Quick Presets & Search */}
            <QuickPresetBar
              onSetAllOk={handleSetAllOk}
              onAddStarToAll={handleAddStarToAll}
              onResetRatings={handleResetRatings}
              onCopyPreview={handleCopyPreview}
              isCopied={isCopied}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalTeamCount={teammates.length}
              filteredCount={filteredTeammates.length}
              soundEnabled={soundEnabled}
              formatStyle={formatStyle}
              onChangeFormatStyle={handleFormatStyleChange}
            />

            {/* List of Teammate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredTeammates.map((teammate) => {
                const currentRating = ratingsMap[teammate.id] || {
                  teammateId: teammate.id,
                  teammateName: teammate.name,
                  statusId: 'ok',
                  statusTag: '[OK]',
                  stars: 0,
                };

                return (
                  <TeammateCard
                    key={teammate.id}
                    teammate={teammate}
                    rating={currentRating}
                    onUpdateRating={handleUpdateRating}
                    soundEnabled={soundEnabled}
                    formatStyle={formatStyle}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Historial (Submission Logs) */}
        {activeTab === 'history' && (
          <FeedbackHistoryView
            history={history}
            formatStyle={formatStyle}
            onDeleteSubmission={handleDeleteSubmission}
            onClearAllHistory={handleClearAllHistory}
            onLoadAsCurrentDraft={handleLoadAsCurrentDraft}
          />
        )}

        {/* Tab 3: Estadísticas & Rankings */}
        {activeTab === 'stats' && <StatsView history={history} teammates={teammates} />}
      </main>

      {/* Sticky Bottom Action Bar (visible during Rating tab) */}
      {activeTab === 'rate' && (
        <FeedbackActionBar
          totalStars={totalStars}
          okCount={okCount}
          needHelpCount={needHelpCount}
          onSendFeedback={handleSendFeedback}
          soundEnabled={soundEnabled}
          previewText={previewText}
        />
      )}

      {/* Manage Team Modal */}
      <ManageTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        teamName={teamName}
        onSaveTeamName={handleSaveTeamName}
        teammates={teammates}
        onSaveTeammates={handleSaveTeammates}
      />

      {/* Initial Team Setup Modal / Onboarding */}
      <InitialSetupModal
        isOpen={isSetupModalOpen}
        currentTeamName={teamName}
        currentTeammates={teammates}
        onCompleteSetup={handleCompleteSetup}
        onClose={() => setIsSetupModalOpen(false)}
        isInitialLaunch={!getIsSetupCompleted()}
      />
    </div>
  );
}

