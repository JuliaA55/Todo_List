import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function usePendingTaskCount() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const pendingTaskCount = tasks.filter((task) => !task.completed).length;

  return pendingTaskCount;
}
