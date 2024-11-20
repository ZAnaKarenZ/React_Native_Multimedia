import { Image, StyleSheet, Platform, Text, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

export default function HomeScreen() {
  const db = SQLite.openDatabaseSync('multimedia.db');
  useEffect(() => {
    const createTable = async() =>{
      try {
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS omatopopih
          (id INTEGER PRIMARY KEY NOT NULL,
          value TEXT NOT NULL, 
          intValue INTEGER);
          INSERT INTO omatopopih (value, intValue) VALUES ('test1', 123);
          INSERT INTO omatopopih (value, intValue) VALUES ('test2', 456);
          INSERT INTO omatopopih (value, intValue) VALUES ('test3', 789);
          `);

      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  return (
    <View>
      <Text>Hello from DatosSqlite!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
