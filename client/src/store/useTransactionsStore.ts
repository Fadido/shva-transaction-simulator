import { create } from 'zustand';
import { api } from '../api/client';
import type { RegionCode, TransactionResponse } from '../types';

interface TxState {
  approved: TransactionResponse[];
  fetchApproved: () => Promise<void>;
  submit: (region: RegionCode, submittedAtUtc: string) => Promise<TransactionResponse>;
}

export const useTransactionsStore = create<TxState>((set, get) => ({
  approved: [],

  fetchApproved: async () => {
    const { data } = await api.get<TransactionResponse[]>('/transactions/approved');
    set({ approved: data });
  },

  submit: async (region, submittedAtUtc) => {
    const { data } = await api.post<TransactionResponse>('/transactions', {
      region,
      submittedAtUtc,
    });
    if (data.status === 'Approved') {
      // refresh list to keep order in sync with server
      await get().fetchApproved();
    }
    return data;
  },
}));
