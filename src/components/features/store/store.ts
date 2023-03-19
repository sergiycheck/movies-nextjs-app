import { create, StateCreator } from "zustand";
import produce from "immer";
import { MovieQueryParams } from "../movies/movies-fiied";
import { devtools } from "zustand/middleware";

export type MoviesState = {
  searchFilters: {
    prevQueryParams: MovieQueryParams;
    setPrevQueryParams: (params: MovieQueryParams) => void;
    queryParams: MovieQueryParams;
    setQueryParams: (params: MovieQueryParams) => void;
    loadMore: boolean;
    setLoadMore: (val: boolean) => void;
    resetQueryParams: () => void;
  };
};

export const createMoviesSearchSlice: StateCreator<
  MoviesState,
  [],
  [],
  MoviesState
> = (set) => ({
  searchFilters: {
    prevQueryParams: {},
    setPrevQueryParams: (params) => {
      set(
        produce((state: MoviesState) => {
          state.searchFilters.prevQueryParams = params;
        })
      );
    },

    queryParams: { limit: 5, offset: 0 },
    setQueryParams: (paramsToSet) =>
      set((state) => {
        const nextState = produce(state, (draft) => {
          Object.entries(paramsToSet).forEach(([key, value]) => {
            const keyOfQueryPramas = key as keyof MovieQueryParams;
            draft.searchFilters.queryParams[keyOfQueryPramas] = value as any;
          });
        });

        return nextState;
      }),
    loadMore: true,
    setLoadMore: (loadMore) =>
      set(
        produce((state: MoviesState) => {
          state.searchFilters.loadMore = loadMore;
        })
      ),
    resetQueryParams: () =>
      set(
        produce((state: MoviesState) => {
          state.searchFilters.queryParams = { offset: 0, limit: 5 };
          state.searchFilters.loadMore = true;
          state.searchFilters.prevQueryParams = {};
        })
      ),
  },
});

export const useBoundMoviesStore = create<MoviesState>()(
  devtools((...all) => ({
    ...createMoviesSearchSlice(...all),
  }))
);
