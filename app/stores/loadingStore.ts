import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  progress: number;
  loadingMessage: string;
  setLoading: (
    isLoading: boolean,
    progress: number,
    loadingMessage: string
  ) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  progress: 0,
  loadingMessage: "",
  setLoading: (isLoading, progress, loadingMessage) =>
    set({ isLoading, progress, loadingMessage }),
}));
