import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';

interface TasksState {
  tasks: Task[];
  pendingCount: number;
}

const initialState: TasksState = {
  tasks: [],
  pendingCount: 0,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
      state.pendingCount = action.payload.filter(task => !task.completed).length;
    },
    toggleTask(state, action: PayloadAction<number>) {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            state.pendingCount -= 1;
          } else {
            state.pendingCount += 1;
          }
      }
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
      if (!action.payload.completed) {
        state.pendingCount += 1;
      }
    },
    removeTask(state, action: PayloadAction<number>) {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
});

export const { setTasks, toggleTask, addTask, removeTask } = tasksSlice.actions;
export const selectUncompletedCount = (state: { tasks: TasksState }) =>
  state.tasks.tasks.filter(task => !task.completed).length;
export default tasksSlice.reducer;
