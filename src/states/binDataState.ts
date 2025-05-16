import { atom } from 'jotai';
import { IMOSBin } from '../types/BinTypes';

export const binDataState = atom<IMOSBin | null>(null);