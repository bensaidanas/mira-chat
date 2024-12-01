import React from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  isLoading?: boolean;
  imageUri?: string;
};

type MessageListProps = {
  messages: Message[];
};

const LoadingIndicator = () => {
  const { colors } = useTheme();
  const [dots] = React.useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  React.useEffect(() => {
    const animations = dots.map((dot, index) =>
      Animated.sequence([
        Animated.delay(index * 200),
        Animated.timing(dot, {
          toValue: 1,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.loop(Animated.parallel(animations)).start();

    return () => animations.forEach(anim => anim.stop());
  }, []);

  return (
    <View style={styles.loadingContainer}>
      {dots.map((dot, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: colors.text,
              opacity: dot,
              transform: [
                {
                  scale: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {messages.map((message) => (
        <View
          key={message.id}
          style={[
            styles.messageContainer,
            message.isUser ? styles.userMessage : styles.aiMessage,
            { backgroundColor: message.isUser ? '#FFFFFF' : colors.border }
          ]}
        >
          {message.isLoading ? (
            <LoadingIndicator />
          ) : (
            <>
              {message.imageUri && (
                <Image source={{ uri: message.imageUri }} style={styles.messageImage} />
              )}
              <Text style={[styles.messageText, { color: message.isUser ? '#000000' : colors.text }]}>
                {message.text}
              </Text>
            </>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
});

export default MessageList;

