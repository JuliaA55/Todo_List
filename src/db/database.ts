import * as SQLite from 'expo-sqlite';
import { Task } from '../types';
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";

const db = SQLite.openDatabaseSync('tasks.db');
export const drizzleDb = drizzle(db);

export const initDB = async () => {
   await drizzleDb.run(sql
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY NOT NULL,
        todo TEXT NOT NULL,
        completed INTEGER NOT NULL,
        priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
        deadline TEXT NOT NULL
      );`
    );
};

export const getAllTasks = async (): Promise<Task[]> => {
    try {
      const result = await drizzleDb.all(sql`SELECT * FROM tasks;`);
      return result.map((item: any) => ({
        ...item,
        completed: item.completed === 1,
      }));
    } catch (error) {
      console.error('Помилка при отриманні завдань:', error);
      throw error;
    }
};
  

export const insertTask = async (task: Task): Promise<void> => {
    try {
      await drizzleDb.run(sql`
        INSERT INTO tasks (id, todo, completed, priority, deadline)
        VALUES (${task.id}, ${task.todo}, ${task.completed ? 1 : 0}, ${task.priority}, ${task.deadline});
      `);
    } catch (error) {
      console.error('Помилка при вставці завдання:', error);
      throw error;
    }
};

 export const toggleTaskStatus = async (id: number, completed: boolean): Promise<void> => {
    try {
      await drizzleDb.run(sql`
        UPDATE tasks SET completed = ${completed ? 1 : 0} WHERE id = ${id};
      `);
    } catch (error) {
      console.error('Помилка при оновленні статусу:', error);
      throw error;
    }
};

export const deleteTask = async (id: number) => {
    try {
        await drizzleDb.run(sql`
          DELETE FROM tasks WHERE id = ${id};
        `);
      } catch (error) {
        console.error('Помилка при видаленні:', error);
        throw error;
      };
};
  
