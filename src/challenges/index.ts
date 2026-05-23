import { Challenge, ChallengeCategory } from '../types/challenge.js';
import { fileBasicsChallenges } from './file-basics.js';
import { fileViewingChallenges } from './file-viewing.js';
import { textProcessingChallenges } from './text-processing.js';
import { permissionsChallenges } from './permissions.js';
import { searchChallenges } from './search.js';
import { pipesRedirectionChallenges } from './pipes-redirection.js';

export const allChallenges: Challenge[] = [
  ...fileBasicsChallenges,
  ...fileViewingChallenges,
  ...textProcessingChallenges,
  ...permissionsChallenges,
  ...searchChallenges,
  ...pipesRedirectionChallenges,
];

export function getChallengesByCategory(category: ChallengeCategory): Challenge[] {
  return allChallenges.filter(c => c.category === category);
}

export function getChallengeById(id: string): Challenge | undefined {
  return allChallenges.find(c => c.id === id);
}

export const categories: ChallengeCategory[] = [
  'file-basics',
  'file-viewing',
  'text-processing',
  'permissions',
  'search',
  'pipes-redirection',
];
