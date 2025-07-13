import fs from 'fs';
import path from 'path';
import { extractExperimentTags } from '../lib/extractExperimentTags';

// Utility to get tags for an experiment file by path
export function getExperimentTagsByPath(filePath: string): string[] {
  try {
    const absPath = path.resolve(filePath);
    const source = fs.readFileSync(absPath, 'utf-8');
    return extractExperimentTags(source);
  } catch (e) {
    return [];
  }
}

// Example usage in a page or experiment loader:
// import { getExperimentTagsByPath } from '../../lib/getExperimentTagsByPath';
// const tags = getExperimentTagsByPath('src/experiments/HexaGrids.tsx');
// <ExperimentHeader name="HexaGrids" source={fs.readFileSync('src/experiments/HexaGrids.tsx', 'utf-8')} />
