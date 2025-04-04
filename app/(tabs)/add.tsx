import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { addTask } from '../../src/features/tasks/tasksSlice';
import { insertTask } from '../../src/db/database';
import { Task } from '../../src/types';
import { useRouter } from 'expo-router';
export default function AddTaskScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [todo, setTodo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleAddTask = () => {
    if (!todo.trim()) {
      Alert.alert('Помилка', 'Назва завдання не може бути порожньою');
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      todo,
      completed: false,
      priority,
      deadline: deadline.toISOString().split('T')[0],
    };

    insertTask(newTask);
    dispatch(addTask(newTask));

    Alert.alert('Готово', 'Завдання додано!');
    router.back();
  };
  const handleConfirmDate = (date: Date) => {
    setDeadline(date);
    setShowPicker(false);
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 20,backgroundColor: '#c4e7ff' }}>
     <Text style={{fontSize: 24,fontWeight: "bold", textAlign: "center",color: "#000", marginBottom:30}}>Додати запис</Text>
      <Text style={{fontSize: 20}}>Завдання:</Text>
      <TextInput style={{fontSize:18,borderWidth:1, borderColor:'black' }} placeholder="Назва завдання..." value={todo} onChangeText={setTodo} />
      <Text style={{fontSize: 20}}>Пріоритет:</Text>
      <View style={{borderWidth: 1}}>
      <Picker  selectedValue={priority} onValueChange={setPriority}>
        <Picker.Item label="Низький" value="low" />
        <Picker.Item label="Середній" value="medium" />
        <Picker.Item label="Високий" value="high" />
      </Picker>
      </View>
      <Text style={{fontSize: 20}}>Дедлайн:</Text>
      <View style={{borderWidth: 1}}>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={{fontSize:18, marginLeft:20}}>{deadline.toDateString()}</Text>
      </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleAddTask}>
        <Text style={{fontSize:18, backgroundColor: 'blue', width: 130, height: 30, marginLeft:190, color: 'white', marginTop: 10}}>Додати задачу</Text>
      </TouchableOpacity>
    </View>
  );
}
