import { Slot, useRouter } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { useEffect } from 'react';
import { initDB } from '../src/db/database';
import * as Notifications from 'expo-notifications';
import { useDispatch } from 'react-redux';
import { registerForPushNotificationsAsync, setNotificationCategory, cancelNotification } from '../src/utils/notifications';
import { removeTask } from '../src/features/tasks/tasksSlice';
import { deleteTask } from '../src/db/database';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export default function RootLayout() {
  const router = useRouter();
 

  useEffect(() => {
    initDB();
    registerForPushNotificationsAsync();
    setNotificationCategory();

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const taskId = response.notification.request.content.data.taskId;
      const action = response.actionIdentifier;

      if (action === 'show') {
        router.push(`/`);
      } else if (action === 'delete') {
        const notificationId = response.notification.request.identifier;
        cancelNotification(notificationId);
        deleteTask(taskId);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
