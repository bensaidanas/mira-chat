import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import MenuIcon from './MenuIcon';

type HeaderProps = {
  onMenuPress: () => void;
  onNewChatPress: () => void;
  showNewChatIcon: boolean;
};

const Header: React.FC<HeaderProps> = ({ onMenuPress, onNewChatPress, showNewChatIcon }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <MenuIcon size={24}  />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Mira</Text>
        </View>
        <View style={styles.rightContainer}>
          {showNewChatIcon && (
            <TouchableOpacity onPress={onNewChatPress} style={styles.newChatButton}>
              <Feather name="edit" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? 8 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontWeight: '600',
  },
  newChatButton: {
    padding: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Header;

