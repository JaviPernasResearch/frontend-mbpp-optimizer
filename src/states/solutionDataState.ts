import { atom } from 'jotai';
import { OptimizationSolution } from '@/types/optimization';

export const solutionDataState = atom<OptimizationSolution | null>(null);