import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidates: [],
  currentCandidate: null,
  status: 'idle',
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    status: '',
    search: '',
    role: '',
  },
};

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setCandidates: (state, action) => {
      state.candidates = action.payload;
    },
    setCurrentCandidate: (state, action) => {
      state.currentCandidate = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('candidates/fetchCandidates/pending', (state) => {
        state.status = 'loading';
      })
      .addCase('candidates/fetchCandidates/fulfilled', (state, action) => {
        state.status = 'succeeded';
        state.candidates = action.payload.candidates;
        state.pagination = action.payload.pagination;
      })
      .addCase('candidates/fetchCandidates/rejected', (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setCandidates,
  setCurrentCandidate,
  setPagination,
  setFilters,
  clearError,
} = candidateSlice.actions;
export default candidateSlice.reducer;
