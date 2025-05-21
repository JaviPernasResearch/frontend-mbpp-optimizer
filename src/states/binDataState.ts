import { atom } from 'jotai';
import { Bin } from '../types/types';

export const binDataState = atom<Bin | null>(null);