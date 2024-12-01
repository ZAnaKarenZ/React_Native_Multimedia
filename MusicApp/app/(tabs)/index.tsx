import { Image, StyleSheet, Platform, Text, View, FlatList, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { createTables, getAllMusicTracks, getAllImages, MusicTrack, ImageFile} from '@/database/DatosSqlite';
import * as SQLite from 'expo-sqlite';

export default function HomeScreen() {

  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await createTables();
      const tracks = await getAllMusicTracks();
      const imageFiles = await getAllImages();
      
      console.log("Tracks fetched from database:", tracks);
      console.log("Images fetched from database:", imageFiles);

      setMusicTracks(tracks);
      setImages(imageFiles);
    };

    initializeDatabase();
  }, []);

  const openModal = (index: number) => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
    <LinearGradient
      // Background Linear Gradient
      colors={['cornflowerblue', 'aliceblue','lightblue']}
      locations={[0.0, 0.3, 1.0]}
      start={{ x: 0.1, y: 0.2 }}
      end={{ x: 0.9, y: 0.8 }}
      style={styles.background}
    />
    <ScrollView style={styles.gradientContainer}>
    {images.map((image, index) => (

    <TouchableOpacity key={index} onPress={() => openModal(index)}>
      <View key={index}>
      <Image
        source={{ uri: image.url }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text>{`Title: ${image.title}`}</Text>
      <Text>{`Author: ${image.author}`}</Text>
      </View>
      </TouchableOpacity>
    ))}
    </ScrollView>
    <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: '100%',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  image: {
    width: 200,
    height: 200,
  },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)'},
  modalTitle: { fontSize: 20, color: 'white', marginBottom: 20 },
  controls: { flexDirection: 'row', justifyContent: 'space-evenly', width: '80%' },
  controlButton: { fontSize: 30, color: 'white' },
  closeButton: { backgroundColor: 'cornflowerblue', padding: 10, borderRadius: 5 },
  closeButtonText: { color: 'white', fontSize: 16 },
});