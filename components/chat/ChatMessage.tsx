import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from './ChatScreen';

type ChatMessageProps = {
  message: Message;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <View style={[styles.container, message.isUser ? styles.userMessage : styles.aiMessage]}>
      <Text style={[styles.text, message.isUser ? styles.userText : styles.aiText]}>
        {message.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  text: {
    fontSize: 16,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#000000',
  },
});

export default ChatMessage;

