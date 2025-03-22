import { StyleSheet, Image, Platform, TextInput, TouchableOpacity, ScrollView, View, KeyboardAvoidingView, useColorScheme } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  interface Message {
    id: number;
    text: string;
    sender: string;
    timestamp: Date;
  }
  
  const colorScheme = useColorScheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showActions, setShowActions] = useState(false);
  const chatScrollRef = useRef<ScrollView>(null);
  
  // Dummy bot responses
  const dummyResponses = [
    "I'm processing your request. Please wait.",
    "Thanks for your message! How can I help you further?",
    "I understand your concern. Let me provide more information.",
    "That's an interesting question! Here's what I know.",
    "I'm sorry, I couldn't understand that. Could you rephrase?",
    "Here's the information you requested about waste management.",
    "Recycling is important for environmental sustainability.",
    "The nearest recycling center is open from 9am to 5pm.",
    "You can report overflowing bins through our main reporting system.",
    "Thanks for helping keep our community clean!"
  ];
  
  // Add this helper function
  const scrollToBottom = () => {
    chatScrollRef.current?.scrollToEnd({ animated: true });
  };

  // Send a message
  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
    
    // Call scrollToBottom here
    setTimeout(scrollToBottom, 50);
    
    // Generate bot response after a short delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: dummyResponses[Math.floor(Math.random() * dummyResponses.length)],
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
      // Call scrollToBottom again after bot message
      setTimeout(scrollToBottom, 50);
    }, 1000);
  };
  
  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    setShowActions(false);
  };
  
  // Rate conversation as satisfied
  const rateConversation = () => {
    setMessages(prevMessages => [
      ...prevMessages, 
      {
        id: Date.now(),
        text: "Thank you for your feedback! We're glad you found this conversation helpful.",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setShowActions(false);
  };
  
  // Replace the current useEffect for scrolling with this improved version
  useEffect(() => {
    if (messages.length > 0) {
      // Immediate scroll without animation on messages change
      chatScrollRef.current?.scrollToEnd({ animated: false });
      
      // Then another scroll with animation after a slightly longer delay
      const timer = setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Get action button background color based on color scheme
  const getActionButtonStyle = () => {
    return [
      styles.actionButton, 
      { 
        backgroundColor: 'transparent' // Remove background color for a cleaner look
      }
    ];
  };

  // Get action button text color based on color scheme
  const getActionButtonTextColor = () => {
    return colorScheme === 'dark' ? '#E0E0E0' : '#333333';
  };

  // Get the send icon color
  const getSendIconColor = () => {
    return inputText.trim() === '' ? "#888" : (colorScheme === 'dark' ? '#1E88E5' : '#2196F3');
  };

  // Get user message background color based on scheme
  const getUserMessageColor = () => {
    return colorScheme === 'dark' ? '#1E88E5' : '#0D47A1'; // More vibrant blue in both modes
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.scrollContainer}>
          <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
              <IconSymbol
                size={310}
                color="#808080"
                name="chevron.left.forwardslash.chevron.right"
                style={styles.headerImage}
              />
            }>
            <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">Chat</ThemedText>
              <TouchableOpacity 
                style={getActionButtonStyle()} 
                onPress={() => setShowActions(!showActions)}
              >
                <IconSymbol 
                  name="gear" 
                  size={24} 
                  color={getActionButtonTextColor()} 
                />
              </TouchableOpacity>
              
              {showActions && (
                <ThemedView style={styles.actionDropdown}>
                  <TouchableOpacity style={styles.actionItem} onPress={clearChat}>
                    <ThemedText>Clear Chat</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionItem} onPress={rateConversation}>
                    <ThemedText>I'm Satisfied</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionItem} onPress={() => setShowActions(false)}>
                    <ThemedText>Cancel</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              )}
            </ThemedView>
            
            <ThemedView style={styles.chatContainer}>
              {/* Chat messages area */}
              <ScrollView 
                ref={chatScrollRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
              >
                {messages.length === 0 ? (
                  <ThemedView style={styles.emptyChat}>
                    <ThemedText style={styles.emptyChatText}>
                      Send a message to start chatting with our assistant.
                    </ThemedText>
                  </ThemedView>
                ) : (
                  messages.map(message => (
                    <ThemedView 
                      key={message.id}
                      style={[
                        styles.messageBubble,
                        message.sender === 'user' 
                          ? [styles.userMessage, { backgroundColor: getUserMessageColor() }] 
                          : styles.botMessage
                      ]}
                    >
                      <ThemedText>{message.text}</ThemedText>
                      <ThemedText style={styles.timestamp}>
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </ThemedText>
                    </ThemedView>
                  ))
                )}
              </ScrollView>
            </ThemedView>
          </ParallaxScrollView>
        </View>
        
        {/* Message input area - fixed at bottom */}
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#888"
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={sendMessage}
            disabled={inputText.trim() === ''}
          >
            <IconSymbol 
              name="arrow.up.circle.fill" 
              size={32} 
              color={getSendIconColor()} 
            />
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 70, // Add padding to make room for input area
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // This pushes elements to the edges
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative', // For proper dropdown positioning
    zIndex: 2, // Ensure dropdown appears above other content
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  actionsContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
    position: 'relative',
    zIndex: 1,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  actionDropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#353636',
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 150,
    borderWidth: 1,
    borderColor: '#555',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  messagesContainer: {
    flex: 1,
    maxHeight: 500, // Adjust as needed
  },
  messagesContent: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
    marginVertical: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#4A4A4A',
    borderBottomLeftRadius: 4,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingVertical: 8,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#353636',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#404040',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: 'white',
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    padding: 5,
  },
  emptyChat: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    opacity: 0.7,
  },
  emptyChatText: {
    textAlign: 'center',
  }
});
