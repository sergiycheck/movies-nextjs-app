import { create, StateCreator } from "zustand";
import produce from "immer";
import { MovieQueryParams } from "../movies/movies-fiied";
import { devtools } from "zustand/middleware";

export type MoviesState = {
  searchFilters: {
    queryParams: MovieQueryParams;
    setQueryParams: (params: MovieQueryParams) => void;
    loadMore: boolean;
    setLoadMore: (val: boolean) => void;
  };
};

export const createMoviesSearchSlice: StateCreator<
  MoviesState,
  [],
  [],
  MoviesState
> = (set) => ({
  searchFilters: {
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
        produce((state) => {
          state.searchFilters.loadMore = loadMore;
        })
      ),
  },
});

export const useBoundMoviesStore = create<MoviesState>()(
  devtools((...all) => ({
    ...createMoviesSearchSlice(...all),
  }))
);
