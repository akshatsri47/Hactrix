import React, { useState } from 'react';
import { View, TextInput, Button, Image, ActivityIndicator, Text } from 'react-native';

const ConvertTextToSignScreen = () => {
  const [text, setText] = useState('');
  const [gifFrames, setGifFrames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleConvertText = async () => {
    setLoading(true);
    setError('');
    setCurrentIndex(0);

    try {
      const response = await fetch('http://127.0.0.1:5000/text-to-sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });
      const data = await response.json();
      setGifFrames(data.gif_frames);
      startDisplayInterval();
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while converting text to sign language.');
    } finally {
      setLoading(false);
    }
  };

  const startDisplayInterval = () => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        if (prevIndex === gifFrames.length - 1) {
          clearInterval(interval);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 2000); // Change the interval duration as needed (e.g., 2000ms = 2 seconds)
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
        onChangeText={setText}
        value={text}
        placeholder="Enter text"
      />
      <Button
        title="Convert to Sign Languages"
        onPress={handleConvertText}
        color="#007AFF" // Set button color to blue
      />
      
      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}
      
      {error ? (
        <Text style={{ color: 'red', alignSelf: 'center', marginTop: 20 }}>{error}</Text>
      ) : (
        <View style={{ marginTop: 20 }}>
          {gifFrames.length > 0 && (
            <Image
              source={{ uri: `data:image/gif;base64,${gifFrames[currentIndex]}` }}
              style={{ width: 200, height: 200, marginBottom: 10 }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default ConvertTextToSignScreen;
