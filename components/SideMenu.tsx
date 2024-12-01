import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, useColorScheme, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';

type ChatHistoryItem = {
  id: string;
  title: string;
};

type SideMenuProps = {
  isOpen: boolean;
  chatHistory: ChatHistoryItem[];
  onChatSelect: (id: string) => void;
};

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.8;

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, chatHistory, onChatSelect }) => {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const sideMenuBackground = colorScheme === 'dark' 
  ? colors.background === '#000000' ? '#1C1C1E' : colors.background + '22'
  : colors.background === '#FFFFFF' ? '#F2F2F7' : colors.background + 'DD';
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -MENU_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnim]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: sideMenuBackground, transform: [{ translateX: slideAnim }] }
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Chat History</Text>
      </View>
      <ScrollView style={styles.chatList}>
        {chatHistory.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() => onChatSelect(chat.id)}
          >
            <Text style={[styles.chatTitle, { color: colors.text }]}>{chat.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.userProfile}>
        <View style={[styles.profilePicture, { backgroundColor: colors.primary }]}>
          <Feather name="user" size={24} color={colors.background} />
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>John Doe</Text>
        <TouchableOpacity onPress={() => console.log('Open settings')} style={styles.settingsButton}>
          <Feather name="more-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        paddingTop: Platform.OS === 'android' ? 8 : 0,
      },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: MENU_WIDTH,
    zIndex: 100,
    padding: 20,
    paddingTop: 60
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    paddingVertical: 15,
  },
  chatTitle: {
    fontSize: 16,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsButton: {
    marginLeft: 'auto',
  },
});

export default SideMenu;

