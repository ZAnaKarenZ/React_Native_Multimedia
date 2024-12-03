import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Button, TouchableHighlight } from 'react-native';
import * as SQLite from 'expo-sqlite';

export const createTables = async() =>{
  try {
    const db = await SQLite.openDatabaseAsync('multimedia');
    await db.runAsync('DROP TABLE IF EXISTS music');
    await db.runAsync('DROP TABLE IF EXISTS images');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS music 
      (id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      duration TEXT NOT NULL,
      url TEXT NOT NULL);

      CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      url TEXT NOT NULL);

      INSERT INTO music (title, author, duration, url) VALUES ('Reflection', 'Broken Elegance', '5:10', 'https://izsqkjgolwzqkkddexcg.supabase.co/storage/v1/object/public/Songs/Broken%20Elegance%20-%20Reflection.mp3?t=2024-12-02T23%3A31%3A24.736Z');
      INSERT INTO images (title, author, url) VALUES ('Reflection', 'Broken Elegance', 'https://is1-ssl.mzstatic.com/image/thumb/Music20/v4/28/53/b7/2853b74e-400a-f023-5a4a-ae39792ac2d1/5054316522331_cover.jpg/592x592bb.webp');
      
      INSERT INTO music (title, author, duration, url) VALUES ('Evergreen', 'Pekoe', '3:07', 'https://izsqkjgolwzqkkddexcg.supabase.co/storage/v1/object/public/Songs/Pekoe%20-%20Evergreen.mp3?t=2024-12-02T23%3A31%3A44.910Z');
      INSERT INTO images (title, author, url) VALUES ('Evergreen', 'Pekoe', 'https://i1.sndcdn.com/artworks-000101310410-0mt1p7-t500x500.jpg');

      INSERT INTO music (title, author, duration, url) VALUES ('Battle Scars', 'Paradise Fears', '4:48', 'https://izsqkjgolwzqkkddexcg.supabase.co/storage/v1/object/public/Songs/Battle%20Scars.mp3?t=2024-12-02T23%3A30%3A19.959Z');
      INSERT INTO images (title, author, url) VALUES ('Battle Scars', 'Paradise Fears', 'https://is1-ssl.mzstatic.com/image/thumb/Music2/v4/ae/b5/e1/aeb5e137-ad51-f496-9e25-ba39237d5f79/954624.jpg/592x592bb.webp');

      INSERT INTO music (title, author, duration, url) VALUES ('Unconditionally', 'Katy Perry', '3:48', 'https://izsqkjgolwzqkkddexcg.supabase.co/storage/v1/object/public/Songs/Unconditionally.mp3?t=2024-12-02T23%3A33%3A45.937Z');
      INSERT INTO images (title, author, url) VALUES ('Unconditionally', 'Katy Perry', 'https://i1.sndcdn.com/artworks-000066243129-s08xsj-t500x500.jpg');

      INSERT INTO music (title, author, duration, url) VALUES ('We ll meet again', 'The Fat Rat & Laura Brehm', '3:15', 'https://izsqkjgolwzqkkddexcg.supabase.co/storage/v1/object/public/Songs/TheFatRat%20&%20Laura%20Brehm%20-%20We%20ll%20Meet%20Again.mp3?t=2024-12-03T11%3A10%3A23.866Z');
      INSERT INTO images (title, author, url) VALUES ('We ll meet again', 'The Fat Rat & Laura Brehm', 'https://i1.sndcdn.com/artworks-LcKYiC6kwkuiezUc-aFwzdQ-t500x500.jpg');

      `);     
    return db;

  } catch (error) {
    console.error(error);
  }
};

export interface MusicTrack {
  id: number;
  title: string;
  author: string;
  duration: string;
  url: string;
}

export interface ImageFile {
  id: number;
  title: string;
  author: string;
  url: string;
}

export const getAllMusicTracks = async (): Promise<MusicTrack[]> => {
  try {
    const db = await SQLite.openDatabaseAsync('multimedia');
    const result = await db.getAllAsync<MusicTrack>('SELECT * FROM music');
    return result;
  } catch (error) {
    console.error('Error fetching music tracks:', error);
    return [];
  }
};

export const getAllImages = async (): Promise<ImageFile[]> => {
  try {
    const db = await SQLite.openDatabaseAsync('multimedia');
    const result = await db.getAllAsync<ImageFile>('SELECT * FROM images');
    console.log(await db.getAllAsync('SELECT * FROM images'));
    return result;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

export const clearAllTables = async () => {
  const db = await SQLite.openDatabaseAsync('multimedia');
  await db.runAsync('DROP TABLE IF EXISTS music');
  await db.runAsync('DROP TABLE IF EXISTS images');
};


 
//Songs stored in: https://supabase.com/dashboard/project/izsqkjgolwzqkkddexcg/storage/buckets/Songs