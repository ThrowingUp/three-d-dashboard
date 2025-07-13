import React from 'react';
import { extractExperimentTags } from '../../lib/extractExperimentTags';

interface ExperimentHeaderProps {
  name: string;
  source: string;
}

export const ExperimentHeader: React.FC<ExperimentHeaderProps> = ({ name, source }) => {
  const tags = extractExperimentTags(source);
  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold tracking-tight">{name}</h1>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="tag tag-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
