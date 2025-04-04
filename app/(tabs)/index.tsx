import React, { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, toggleTask, removeTask} from '../../src/features/tasks/tasksSlice';
import { getAllTasks, toggleTaskStatus, deleteTask } from '../../src/db/database';
import { RootState } from '../../src/store';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const pendingCount = useSelector((state: any) => state.tasks.pendingCount);

  useEffect(() => {
    getAllTasks().then(fetched => {
      dispatch(setTasks(fetched));
    });
  }, []);

  const handleToggle = (id: number) => {
    dispatch(toggleTask(id));
    const task = tasks.find(t => t.id === id);
    if (task) {
      toggleTaskStatus(id, !task.completed);
    }
  };

  const handleDelete = (id: number) => {
    deleteTask(id);
    dispatch(removeTask(id));
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#c4e7ff'}}>
      <Text style={{fontSize: 24,fontWeight: "bold", textAlign: "center", marginTop: 40, color: "#000"}}>ODOT List</Text>
      <Text style={{fontSize: 16, textAlign: "center",color: "#000",marginBottom: 10}}>4th March 2018</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
        <Text style={{ fontSize: 20 }}>Невиконано: {pendingCount}</Text>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleToggle(item.id)}>
            <View
              style={{
                padding: 16,
                backgroundColor: item.completed ? '#cfc' : '#fcc',
                marginVertical: 4,
                borderRadius: 8,
              }}>
              <Text style={{ fontWeight: 'bold' }}>{item.todo}</Text>
              <Text>📅 Deadline: {item.deadline}</Text>
              <Text>⚡ Priority: {item.priority}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={{ color: 'red' }}>Видалити</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/add')}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'blue',
          padding: 15,
          borderRadius: 50,
        }}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
