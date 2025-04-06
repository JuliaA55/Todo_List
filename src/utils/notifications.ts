import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const registerForPushNotificationsAsync = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  }
  return false;
};

export const scheduleTaskNotification = async (taskId: number, title: string, deadline: string) => {
  const triggerDate = new Date(deadline);
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Дедлайн завдання!",
      body: title,
      data: { taskId },
      categoryIdentifier: 'task-actions',
    },
    trigger: new Date(deadline) as unknown as Notifications.NotificationTriggerInput
  });
  return id;
};

export const cancelNotification = async (notificationId: string) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

export const setNotificationCategory = async () => {
  await Notifications.setNotificationCategoryAsync('task-actions', [
    {
      identifier: 'show',
      buttonTitle: 'Show',
      options: { opensAppToForeground: true },
    },
    {
      identifier: 'delete',
      buttonTitle: 'Delete',
      options: { isDestructive: true },
    },
  ]);
};
