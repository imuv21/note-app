import { createSlice } from '@reduxjs/toolkit';
import { addNote, updateNote, getAllNotes, getNote, deleteNote  } from '../thunks/noteThunks';

const initialState = {

    addLoading: false,
    addErrors: null,
    addError: null,

    editLoading: false,
    editErrors: null,
    editError: null,

    notes: [],
    totalNotes: 0,
    totalPages: 0,
    pageNotes: 0,
    isFirst: false,
    isLast: false,
    hasNext: false,
    hasPrevious: false,
    getAllLoading: false,
    getAllError: null,

    note: null,
    getLoading: false,
    getError: null,

    delLoading: false,
    delError: null
};

const noteSlice = createSlice({
    name: 'note',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.addError = null;
            state.addErrors = null;
            state.editError = null;
            state.editErrors = null;
            state.getAllError = null;
            state.getError = null;
            state.delError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addNote.pending, (state) => {
                state.addLoading = true;
                state.addErrors = null;
                state.addError = null;
            })
            .addCase(addNote.fulfilled, (state) => {
                state.addLoading = false;
                state.addErrors = null;
                state.addError = null;
            })
            .addCase(addNote.rejected, (state, action) => {
                state.addLoading = false;
                if (Array.isArray(action.payload)) {
                    state.addErrors = action.payload;
                } else {
                    state.addError = action.payload?.message || "Something went wrong!";
                }
            })

            .addCase(updateNote.pending, (state) => {
                state.editLoading = true;
                state.editErrors = null;
                state.editError = null;
            })
            .addCase(updateNote.fulfilled, (state) => {
                state.editLoading = false;
                state.editErrors = null;
                state.editError = null;
            })
            .addCase(updateNote.rejected, (state, action) => {
                state.editLoading = false;
                if (Array.isArray(action.payload)) {
                    state.editErrors = action.payload;
                } else {
                    state.editError = action.payload?.message || "Something went wrong!";
                }
            })

            .addCase(getAllNotes.pending, (state) => {
                state.getAllLoading = true;
                state.getAllError = null;
            })
            .addCase(getAllNotes.fulfilled, (state, action) => {
                state.getAllLoading = false;
                state.getAllError = null;

                state.notes = action.payload?.notes || [];
                state.totalNotes = action.payload?.totalNotes || 0;
                state.totalPages = action.payload?.totalPages || 0;
                state.pageNotes = action.payload?.pageNotes || 0;

                state.isFirst = action.payload?.isFirst || false;
                state.isLast = action.payload?.isLast || false;
                state.hasNext = action.payload?.hasNext || false;
                state.hasPrevious = action.payload?.hasPrevious || false;
            })
            .addCase(getAllNotes.rejected, (state, action) => {
                state.getAllLoading = false;
                state.getAllError = action.payload?.message || "Something went wrong!";
            })

            .addCase(getNote.pending, (state) => {
                state.getLoading = true;
                state.getError = null;
            })
            .addCase(getNote.fulfilled, (state, action) => {
                state.getLoading = false;
                state.getError = null;
                state.note = action.payload?.note || null;
            })
            .addCase(getNote.rejected, (state, action) => {
                state.getLoading = false;
                state.getError = action.payload?.message || "Something went wrong!";
            })

            .addCase(deleteNote.pending, (state) => {
                state.delLoading = true;
                state.delError = null;
            })
            .addCase(deleteNote.fulfilled, (state) => {
                state.delLoading = false;
                state.delError = null;
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.delLoading = false;
                state.delError = action.payload?.message || "Something went wrong!";
            })
    },
});

export const { clearErrors } = noteSlice.actions;
export default noteSlice.reducer;