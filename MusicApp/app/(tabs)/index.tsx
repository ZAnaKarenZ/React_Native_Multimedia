import { Image, StyleSheet, Platform, Text, View, FlatList, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { createTables, getAllMusicTracks, getAllImages, MusicTrack, ImageFile} from '@/database/DatosSqlite';
import * as SQLite from 'expo-sqlite';

export default function HomeScreen() {

  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  //Inicializar
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


  //Open modal when clicking on an album cover
  const openModal = (index: number) => {
    setModalVisible(true);
    loadTrack(index);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  // Function to play or pause the current track
const togglePlayPause = async () => {
  if (sound) {
    const status = await sound.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      // Pause the track
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (status.isLoaded) {
      // Play the track
      await sound.playAsync();
      setIsPlaying(true);
    }
  }
};


// Load the selected track into the Audio.Sound object
const loadTrack = async (index: number) => {
  if (sound) {
    await sound.unloadAsync();
  }

  const newSound = new Audio.Sound();
  const track = musicTracks[index];

  try {
    await newSound.loadAsync({ uri: track.url });
    setSound(newSound);
    setCurrentTrackIndex(index);
    setIsPlaying(false); // Initially paused
  } catch (error) {
    console.error('Error loading track:', error);
  }
};

//Change track if clicked on previous or next
const changeTrack = async (direction: 'previous' | 'next') => {
  if (currentTrackIndex === null) return;

  let newIndex = currentTrackIndex;
  if (direction === 'previous') {
    newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : musicTracks.length - 1; // Loop to the last track
  } else if (direction === 'next') {
    newIndex = (currentTrackIndex + 1) % musicTracks.length; // Loop to the first track
  }

  loadTrack(newIndex);
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
          {currentTrackIndex !== null && images[currentTrackIndex] && (
        <Image
          source={{ uri: images[currentTrackIndex].url }}
          style={styles.modalImage}
          resizeMode="contain"
        />
        )}
        <Text style={styles.modalTitle}>
          {currentTrackIndex !== null ? musicTracks[currentTrackIndex]?.title : 'No track selected'}
        </Text>
        <View style={styles.controls}>
      <TouchableOpacity onPress={() => changeTrack('previous')} style={styles.controlButtonContainer}>
        <Text style={styles.controlButton}>{'<<'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={togglePlayPause} style={styles.controlButtonContainer}>
        <Text style={styles.controlButton}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeTrack('next')} style={styles.controlButtonContainer}>
        <Text style={styles.controlButton}>{'>>'}</Text>
      </TouchableOpacity>
    </View>
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
  modalContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  modalTitle: { 
    fontSize: 20,
    color: 'white',
    marginBottom: 20 
  },
  controls: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    width: '80%' 
  },
  controlButtonContainer: { 
    padding: 10, 
    borderRadius: 5, 
    backgroundColor: 'cornflowerblue' 
  },
  controlButton: { 
    fontSize: 30, 
    color: 'white',
    textAlign: 'center'
  },
  closeButton: { 
    backgroundColor: 'cornflowerblue', 
    padding: 10, 
    borderRadius: 5 
  },
  closeButtonText: {
     color: 'white',
     fontSize: 16 
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
});