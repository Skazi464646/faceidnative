import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [photoUri, setPhotoUri] = useState('');
  const [message, setMessage] = useState('');
  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  // capture, upload functions will go here

  return (
    <View style={{ flex: 1 }}>
      {!photoUri ? (
        <Camera style={{ flex: 1 }} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={takePicture}
            >
              <Text style={styles.text}> SNAP </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
          <Image source={{ uri: photoUri }} style={{ width:300, height:400 }} />
          <TouchableOpacity onPress={uploadPhoto} style={styles.button}>
            <Text style={styles.text}> VERIFY </Text>
          </TouchableOpacity>
        </View>
      )}
      {!!message && <Text style={{ textAlign: 'center' }}>{message}</Text>}
    </View>
  );

  async function takePicture() {
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: false };
      const data = await cameraRef.current.takePictureAsync(options);
      setPhotoUri(data.uri);
    }
  }

  async function uploadPhoto() {
    setMessage('Uploading...');
    const form = new FormData();
    form.append('username', 'your_user'); // hardcode or get from login
    form.append('file', {
      uri: photoUri,
      name: 'photo.jpg',
      type: 'image/jpeg'
    });

    try {
      const res = await fetch('http://YOUR_LOCAL_IP:8000/verify/', {
        method: 'POST',
        body: form,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const json = await res.json();
      setMessage(json.verified ? '✅ Verified!' : `❌ Not a match (${json.distance.toFixed(2)})`);
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  }
}

const styles = StyleSheet.create({
  buttonContainer: { flex:1, backgroundColor:'transparent', justifyContent:'flex-end' },
  button: { alignSelf:'center', padding:20, backgroundColor:'#fff', borderRadius:10 },
  text: { fontSize:18, color:'#000' }
});
