import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  currentUser: null,
  status: 'idle',
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('users/fetchUsers/pending', (state) => {
        state.status = 'loading';
      })
      .addCase('users/fetchUsers/fulfilled', (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase('users/fetchUsers/rejected', (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setUsers, setCurrentUser, setPagination, clearError } = usersSlice.actions;
export default usersSlice.reducer;
