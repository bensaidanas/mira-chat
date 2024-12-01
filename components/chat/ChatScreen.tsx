import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Header from '../Header';
import SideMenu from '../SideMenu';
import MessageList from './MessageList';
import InputBar from './InputBar';


export type Message = {
    id: number;
    text: string;
    isUser: boolean;
    isLoading?: boolean;
    imageUri?: string;
  };
  
  type IconName = keyof typeof Feather.glyphMap;
  
  const suggestions: Array<{
    text: string;
    icon: IconName;
    color: string;
  }> = [
    { text: "I need a plumber", icon: "tool", color: "#4A90E2" },
    { text: "Looking for an electrician", icon: "zap", color: "#F5A623" },
    { text: "Car mechanic needed", icon: "truck", color: "#7ED321" },
    { text: "House cleaning service", icon: "home", color: "#BD10E0" },
    { text: "Gardener required", icon: "scissors", color: "#50E3C2" },
  ];
  
  const mockChatHistory = [
    { id: '1', title: 'Plumbing issue' },
    { id: '2', title: 'Electrical repair' },
    { id: '3', title: 'Car maintenance' },
    { id: '4', title: 'House cleaning' },
    { id: '5', title: 'Gardening service' },
  ];
  
  export default function ChatScreen() {
    const { colors } = useTheme();
    const [messages, setMessages] = useState<Message[]>([]);
    const [showInitialView, setShowInitialView] = useState(true);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
  
    const handleSend = (text: string, imageUri?: string) => {
      setShowInitialView(false);
      const newMessage: Message = { id: messages.length + 1, text, isUser: true, imageUri };
      setMessages([...messages, newMessage]);
      
      if (text.toLowerCase().includes("electrician")) {
        handleElectricianScenario();
      } else {
        simulateTyping("I understand you need assistance. Could you please provide more details about the service you require?");
      }
    };
  
    const handleElectricianScenario = () => {
      simulateTyping("I can help you find an electrician. Would you like me to send one right away?");
    };
  
    const simulateTyping = (text: string) => {
      setMessages(prevMessages => [...prevMessages, { id: prevMessages.length + 1, text: '', isUser: false, isLoading: true }]);
  
      setTimeout(() => {
        setMessages(prevMessages => {
          const updatedMessages = prevMessages.filter(msg => !msg.isLoading);
          return [...updatedMessages, { id: updatedMessages.length + 1, text, isUser: false }];
        });
        scrollToBottom();
      }, 2000);
    };
  
    const scrollToBottom = () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    };
  
    const handleSuggestionPress = (suggestion: string) => {
      setShowInitialView(false);
      handleSend(suggestion);
    };
  
    const handleMenuPress = () => {
      setIsSideMenuOpen(!isSideMenuOpen);
    };
  
    const handleChatSelect = (id: string) => {
      console.log(`Selected chat: ${id}`);
      setIsSideMenuOpen(false);
      // Here you would typically load the selected chat
    };
  
    const handleOutsidePress = () => {
      if (isSideMenuOpen) {
        setIsSideMenuOpen(false);
      }
    };
  
    const handleNewChat = () => {
      setMessages([]);
      setShowInitialView(true);
    };
  
    return (
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
          <Header 
            onMenuPress={handleMenuPress}
            onNewChatPress={handleNewChat}
            showNewChatIcon={!showInitialView}
          />
        </SafeAreaView>
        <SideMenu
          isOpen={isSideMenuOpen}
          chatHistory={mockChatHistory}
          onChatSelect={handleChatSelect}
        />
        <TouchableOpacity activeOpacity={1} onPress={handleOutsidePress} style={styles.mainContent}>
          {showInitialView ? (
            <View style={styles.initialViewContainer}>
              <Text style={[styles.title, { color: colors.text }]}>How can I assist you today?</Text>
              <View style={styles.suggestionsContainer}>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.suggestionButton, { backgroundColor: colors.border }]}
                    onPress={() => handleSuggestionPress(suggestion.text)}
                  >
                    <Feather name={suggestion.icon} size={18} color={suggestion.color} style={styles.suggestionIcon} />
                    <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.chatContainer}>
              <ScrollView 
                ref={scrollViewRef}
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                onContentSizeChange={scrollToBottom}
              >
                <MessageList messages={messages} />
              </ScrollView>
            </View>
          )}
        </TouchableOpacity>
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.background }}>
          <InputBar onSend={handleSend} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    mainContent: {
      flex: 1,
    },
    chatContainer: {
      flex: 1,
      marginTop: 8,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    initialViewContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    suggestionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    suggestionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 12,
      margin: 4,
      width: '45%',
    },
    suggestionIcon: {
      marginRight: 8,
    },
    suggestionText: {
      fontSize: 14,
      flex: 1,
    },
  });
  