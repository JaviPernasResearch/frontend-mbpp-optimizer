import { atom } from 'jotai';
import { Part } from '../types/BinTypes';

export const partsDataState = atom<Part[] | null>(null);