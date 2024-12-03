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
  //UseState for music and audio
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  //Initialize Database and get all music tracks and image files
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

  // Load the selected track into the Audio.Sound object
  const loadTrack = async (index: number) => {
    //Unload existing sound object to avoid overlapping and create a new sound object
    if (sound) {
      await sound.unloadAsync();
    }
    const newSound = new Audio.Sound();

    //Find the track for the current index and load into new sound object
    const track = musicTracks[index];
    try {
      await newSound.loadAsync({ uri: track.url });
      setSound(newSound);
      setCurrentTrackIndex(index);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error loading track:', error);
    }
  };

  //Open modal when clicking on an album cover
  const openModal = (index: number) => {
    setModalVisible(true);
    loadTrack(index);
  };

  //Stop audio and close modal
  const closeModal = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
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

  //Change track if clicked on previous or next
  const changeTrack = async (direction: 'previous' | 'next') => {
    //Stop current song from playing
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
    if (currentTrackIndex === null) return;
    let newIndex = currentTrackIndex;

    //Go to the previous song and if it is the first song, go to the last song
    if (direction === 'previous') {
      newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : musicTracks.length - 1;
    //Go to the next song and if it is the last song, go to the first song (using %)
    } else if (direction === 'next') {
      newIndex = (currentTrackIndex + 1) % musicTracks.length;
    }

    loadTrack(newIndex);
  };

    return (
      <View style={styles.container}>
        {/*Background gradient*/}
        <LinearGradient
          colors={['cornflowerblue', 'aliceblue','lightblue']}
          locations={[0.0, 0.3, 1.0]}
          start={{ x: 0.1, y: 0.2 }}
          end={{ x: 0.9, y: 0.8 }}
          style={styles.background}
        />

        {/* List of album covers */}
        <ScrollView style={styles.gradientContainer}>
          {images.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => openModal(index)}>
              {/* Covers */}
              <View key={index}>
                <Image
                  source={{ uri: image.url }}
                  style={styles.image}
                  resizeMode="cover"
                />
              {/* Text */}
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>{image.title}</Text>
                <Text style={styles.authorText}>{`by ${image.author}`}</Text>
              </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Modal for playing songs */}
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              {/* Close button */}
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

            {/* Cover and title*/}
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
              
            {/* Previous, next, pause, play */}
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
      borderRadius: 15,    
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 100,
      right: 20,
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
    textContainer: {
      padding: 10,
      marginBottom: 15,
    },
    titleText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    authorText: {
      fontSize: 14,
      color: '#666',
    },
  });