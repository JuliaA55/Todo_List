import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { useEffect } from 'react';
import { initDB } from '../src/db/database';

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
