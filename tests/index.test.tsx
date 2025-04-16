import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)/index';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import * as db from '../src/db/database';
import * as notif from '../src/utils/notifications';
import * as hooks from '../src/hooks/useTaskActions';
import * as expoRouter from 'expo-router';
import { Router } from 'expo-router';
import { ThunkMiddleware } from 'redux-thunk';
import { AnyAction, Middleware } from 'redux';

interface RootState {
    tasks: {
      tasks: any[];
    };
  }
  
const mockStore = configureStore<RootState, AnyAction>();
jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    return {
      FontAwesome: ({ name, size, color }: any) =>
        React.createElement('FontAwesome', { name, size, color }),
    };
  });
  
  jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
    isLoaded: jest.fn(() => true),
  }));

  
jest.mock('../src/db/database');
jest.mock('../src/utils/notifications');
jest.mock('../src/hooks/useTaskActions');
jest.mock('../src/hooks/usePendingTaskCount', () => ({
  usePendingTaskCount: () => 1,
}));

const mockPush = jest.fn();
jest.spyOn(expoRouter, 'useRouter').mockReturnValue({
    push: mockPush,
    back: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
    replace: jest.fn(),
    prefetch: jest.fn(),
    setParams: jest.fn(),
    navigate: jest.fn(),
  } as unknown as Router);

const mockTask = {
  id: 1,
  todo: 'Тестове завдання',
  completed: false,
  deadline: '2025-04-15',
  priority: 'High',
  notificationId: 'abc123',
};

describe('HomeScreen', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      tasks: { tasks: [mockTask] },
    });

    (db.getAllTasks as jest.Mock).mockResolvedValue([mockTask]);
    (hooks.useTaskActions as jest.Mock).mockReturnValue({
      handleRemoveTask: jest.fn(),
    });

    render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );
  });

  it('відображає заголовок "ODOT List"', async () => {
    expect(await screen.findByText('ODOT List')).toBeTruthy();
  });

  it('відображає кількість невиконаних завдань', async () => {
    expect(await screen.findByText('Невиконано: 1')).toBeTruthy();
  });

  it('відображає завдання зі строками Deadline та Priority', async () => {
    expect(await screen.findByText('Тестове завдання')).toBeTruthy();
    expect(await screen.findByText(/Deadline/)).toBeTruthy();
    expect(await screen.findByText(/Priority/)).toBeTruthy();
  });

  it('видаляє завдання при натисканні "Видалити"', async () => {
    const mockRemove = jest.fn();
    (hooks.useTaskActions as jest.Mock).mockReturnValue({
      handleRemoveTask: mockRemove,
    });

    fireEvent.press(await screen.findByText('Видалити'));

    await waitFor(() => {
      expect(notif.cancelNotification).toHaveBeenCalledWith('abc123');
      expect(mockRemove).toHaveBeenCalledWith(1);
    });
  });

  it('переходить на екран додавання при натисканні кнопки "+"', async () => {
    const addButton = await screen.findByRole('button');
    fireEvent.press(addButton);
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/add');
  });
});
