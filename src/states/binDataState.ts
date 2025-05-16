import { atom } from 'jotai';
import { Bin } from '../types/BinTypes';

export const binDataState = atom<Bin | null>(null);