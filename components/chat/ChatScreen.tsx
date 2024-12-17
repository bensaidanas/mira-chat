import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Header from '../Header';
import MessageList from './MessageList';
import InputBar from './InputBar';
import SideMenu from '../SideMenu';
import TaskForm, { TaskData } from '../TaskForm';

export type Message = {
  id: number;
  text: string;
  isUser: boolean;
  isLoading?: boolean;
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
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState('');

  const handleSend = (text: string) => {
    setShowInitialView(false);
    const newMessage: Message = { id: messages.length + 1, text, isUser: true };
    setMessages([...messages, newMessage]);
  };

  const simulateTyping = (text: string) => {
    setMessages(prevMessages => [...prevMessages, { id: prevMessages.length + 1, text: '', isUser: false, isLoading: true }]);

    setTimeout(() => {
      setMessages(prevMessages => {
        const updatedMessages = prevMessages.filter(msg => !msg.isLoading);
        return [...updatedMessages, { id: updatedMessages.length + 1, text, isUser: false }];
      });
    }, 2000);
  };

  const handleSuggestionPress = (suggestion: string) => {
    const taskDescription = suggestion.replace(/^(I need |Looking for )/, '');
    setCurrentTask(taskDescription);
    setIsTaskFormVisible(true);
  };

  const handleTaskSubmit = (taskData: TaskData) => {
    const userSummary = `I need ${taskData.task}. The task should be completed by ${taskData.dateTime.toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
  .replace(/(\d{1,2}):(\d{2})/, (match, p1, p2) => `${p1.padStart(2, '0')}:${p2}`)}. My budget for this task is $${taskData.amount}.${taskData.additionalInfo ? ` Additional details: ${taskData.additionalInfo}` : ''}`;
    handleSend(userSummary);

    setTimeout(() => {
      const botResponse = `Thank you for providing the details for your ${taskData.task} request. I've noted that you need this completed by ${taskData.dateTime.toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
  .replace(/(\d{1,2}):(\d{2})/, (match, p1, p2) => `${p1.padStart(2, '0')}:${p2}`)} and your budget is $${taskData.amount}.${taskData.additionalInfo ? ` I've also noted the additional details you provided.` : ''} I'll start looking for suitable professionals who can help you with this task. Is there anything else you'd like to add or any questions you have?`;
      simulateTyping(botResponse);
    }, 1000);
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
            >
              <MessageList messages={messages} />
            </ScrollView>
          </View>
        )}
      </TouchableOpacity>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.background }}>
        <InputBar onSend={handleSend} />
      </SafeAreaView>
      <TaskForm
        isVisible={isTaskFormVisible}
        onClose={() => setIsTaskFormVisible(false)}
        onSubmit={handleTaskSubmit}
        initialTask={currentTask}
      />
    </View>
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

