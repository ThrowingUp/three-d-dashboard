'use client';

import { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Experiment, ExperimentCategory } from '@/types/experiments';
import { experimentCategories, filterExperimentsByCategory, searchExperiments } from '@/lib/experiments';

interface ExperimentSidebarProps {
  experiments: Experiment[];
  currentExperiment?: string;
  onExperimentSelect: (experimentId: string) => void;
}

// Verzamel alle unieke tags uit de experimentenlijst
type TagCount = { tag: string; count: number };
function getAllTags(experiments: Experiment[]): TagCount[] {
  const tagMap = new Map<string, number>();
  experiments.forEach(exp => {
    exp.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagMap.entries()).map(([tag, count]) => ({ tag, count }));
}

export default function ExperimentSidebar({ 
  experiments, 
  currentExperiment, 
  onExperimentSelect 
}: ExperimentSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExperimentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const allTags = useMemo(() => getAllTags(experiments), [experiments]);

  // Filter op categorie én tags
  const filteredExperiments = useMemo(() => {
    let result = selectedCategory === 'all' 
      ? experiments 
      : filterExperimentsByCategory(experiments, selectedCategory);
    if (selectedTags.length > 0) {
      result = result.filter(exp => selectedTags.every(tag => exp.tags.includes(tag)));
    }
    return result;
  }, [experiments, selectedCategory, selectedTags]);

  const searchedExperiments = searchQuery 
    ? searchExperiments(filteredExperiments, searchQuery)
    : filteredExperiments;

  // Refresh experiments API call
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetch('/api/refresh-experiments', { method: 'POST' });
    setRefreshing(false);
    window.location.reload();
  };

  return (
    <div
      className={
        `fixed left-2 top-2 bottom-2 z-50 bg-[var(--background-overlay)] backdrop-blur-md border border-[var(--border-color)] ` +
        `rounded-lg shadow-2xl transition-all duration-300 ease-in-out ` +
        (isCollapsed ? 'w-12 ' : 'w-78 ') +
        (isCollapsed ? 'max-lg:w-12 ' : 'max-lg:w-72 ') +
        (isCollapsed ? 'max-md:w-10 ' : 'max-md:w-64 ')
      }
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-1 top-6 bg-[var(--background-primary)] border border-[var(--border-color)] rounded-full p-1.5 
                   shadow-md hover:shadow-lg transition-shadow"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-4 h-4 text-[var(--text-secondary)]" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4 text-[var(--text-secondary)]" />
        )}
      </button>

      {/* Sidebar Content */}
      <div className={`h-full flex flex-col ${isCollapsed ? 'hidden' : 'block'}`}>
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Three.js Map</h2>
        </div>
        {/* Search */}
        <div className="px-4 pt-4 pb-3 border-b border-[var(--border-color)]">
          <input
            type="text"
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2.5 border border-[var(--border-color)] rounded-lg text-sm bg-[var(--background-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200"
          />
        </div>
        {/* Categories */}
        <div className="px-4 pt-3 pb-3 border-b border-[var(--border-color)]">
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ExperimentCategory | 'all')}
            className="w-full px-3 py-2.5 border border-[var(--border-color)] rounded-lg text-sm bg-[var(--background-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Categories</option>
            {experimentCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        {/* Tag Filter */}
        <div className="px-4 pt-3 pb-3 border-b border-[var(--border-color)]">
          <button
            type="button"
            className="w-full flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] mb-2 p-2 uppercase tracking-wider hover:text-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] border-t border-b border-[var(--border-color)] py-2 px-1 transition bg-transparent"
            onClick={() => setShowAllTags((v: boolean) => !v)}
            aria-pressed={showAllTags}
            title="Toon of verberg alle tags"
          >
            <span>Tags</span>
            <span className="text-[var(--brand-primary)] font-normal ml-2">{showAllTags ? 'verberg' : 'toon alles'}</span>
          </button>
          {showAllTags && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {allTags.map(({ tag, count }) => (
                <button
                  key={tag}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium uppercase border transition bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] focus:bg-[var(--background-secondary)] border-transparent` +
                    (selectedTags.includes(tag)
                      ? ' bg-[var(--background-card)] text-[var(--brand-primary)]'
                      : '')}
                  onClick={() => {
                    setSelectedTags(selectedTags.includes(tag)
                      ? selectedTags.filter(t => t !== tag)
                      : [...selectedTags, tag]);
                  }}
                  aria-pressed={selectedTags.includes(tag)}
                >
                  {tag} <span className="opacity-60">({count})</span>
                </button>
              ))}
              {allTags.length === 0 && (
                <span className="text-xs text-[var(--text-secondary)]">No tags</span>
              )}
            </div>
          )}
        </div>
        {/* Experiments List */}
        <div className="flex-1 overflow-y-auto px-2 pt-3 pb-2">
          {searchedExperiments.length === 0 ? (
            <div className="p-4 text-center text-[var(--text-secondary)]">
              <p className="text-xs">No experiments found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {searchedExperiments.map((experiment) => (
                <button
                  key={experiment.id}
                  onClick={() => onExperimentSelect(experiment.id)}
                  type="button"
                  tabIndex={0}
                  className={`w-full text-left p-3 rounded-md transition-colors duration-150 pointer-events-auto flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] border ${currentExperiment === experiment.id ? 'bg-[var(--brand-primary)/15] border-[var(--brand-primary)]' : 'border-transparent'} bg-transparent hover:bg-[var(--background-secondary)] focus:bg-[var(--background-secondary)]`}
                >
                  <div className="w-full">
                    {/* Title */}
                    <p className={`font-semibold text-base leading-tight truncate
                      ${currentExperiment === experiment.id
                        ? 'text-[var(--brand-primary)]'
                        : 'text-[var(--text-primary)]'
                      }`}>
                      {experiment.title}
                    </p>
                    {/* Description */}
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                      {experiment.description}
                    </p>
                    {/* Tags - max 2 */}
                    <div className="flex items-center mt-1.5 gap-1.5">
                      {experiment.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 bg-[var(--background-accent)] text-[var(--text-secondary)] 
                                     rounded-md text-[10px] font-medium tracking-wide uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                      {experiment.tags.length > 2 && (
                        <span className="text-[10px] text-[var(--text-secondary)] font-medium">
                          +{experiment.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Footer + Refresh */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--background-secondary)/50] flex flex-col gap-2 items-center">
          <p className="text-xs text-[var(--text-secondary)] text-center font-medium">
            {searchedExperiments.length} experiment{searchedExperiments.length !== 1 ? 's' : ''} found
          </p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-1 px-3 py-1.5 rounded-md bg-[var(--brand-primary)] text-white text-xs font-semibold shadow hover:bg-[var(--brand-primary-dark)] disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {refreshing ? 'Refreshing...' : 'Refresh experiments'}
          </button>
        </div>
      </div>
      {/* Collapsed State */}
      {isCollapsed && (
        <div className="h-full flex flex-col items-center justify-center p-2">
          <div className="text-xs text-[var(--text-secondary)] writing-vertical text-center">
            Experiments
          </div>
        </div>
      )}
    </div>
  );
}
