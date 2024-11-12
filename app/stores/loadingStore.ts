import { create } from "zustand";

interface LoadingState {
  loading: boolean;
  progress: number;
  loadingText: string;
  setLoading: (loading: boolean, progress: number, loadingText: string) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  loading: false,
  progress: 0,
  loadingText: "",
  setLoading: (loading: boolean, progress: number, loadingText: string) =>
    set({ loading, progress, loadingText }),
}));
