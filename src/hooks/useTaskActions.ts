import { useDispatch } from 'react-redux';
import { addTask, removeTask } from '../features/tasks/tasksSlice';
import { insertTask, deleteTask } from '../db/database';
import { Task } from '../types';

export function useTaskActions() {
  const dispatch = useDispatch();

  const handleAddTask = (task: Task) => {
    insertTask(task);
    dispatch(addTask(task));
  };

  const handleRemoveTask = (taskId: number) => {
    deleteTask(taskId);
    dispatch(removeTask(taskId));
  };

  return {
    handleAddTask,
    handleRemoveTask,
  };
}
