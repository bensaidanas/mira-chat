import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

type InputBarProps = {
  onSend: (text: string, imageUri?: string) => void;
};

const InputBar: React.FC<InputBarProps> = ({ onSend }) => {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (text.trim() || imageUri) {
      onSend(text, imageUri || undefined);
      setText('');
      setImageUri(null);
    }
  };

  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      inputRef.current?.focus();
    }
  };

  const handleDeleteImage = () => {
    setImageUri(null);
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity onPress={handleDeleteImage} style={styles.deleteButton}>
              <Feather name="x" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.text }]}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor={colors.text}
          multiline
          numberOfLines={1}
          maxLength={1000}
        />
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleCameraPress} style={styles.iconButton}>
          <Feather name="camera" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: 'white' }]}>
          <Ionicons name="send" size={20} color={colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    paddingTop: 0,
    paddingBottom: 0,
    maxHeight: 100,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    marginRight: 5,
  },
  imagePreviewContainer: {
    marginRight: 8,
    marginBottom: 4,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InputBar;

