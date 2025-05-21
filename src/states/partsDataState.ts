import { atom } from 'jotai';
import { Part } from '../types/types';

export const partsDataState = atom<Part[] | null>(null);