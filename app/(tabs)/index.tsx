import { Image, StyleSheet, Platform, SafeAreaView, TextInput, TouchableOpacity, ScrollView, View, useColorScheme } from 'react-native';
import { Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [text, onChangeText] = React.useState('');
  const [selectedLocation, setSelectedLocation] = React.useState<number | null>(null);
  const [selectedDustbin, setSelectedDustbin] = React.useState<string | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = React.useState(false);
  const [showDustbinDropdown, setShowDustbinDropdown] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  
  // Dummy location data
  const locationData = [
    {
      id: 1,
      name: "Downtown Park",
      dustbins: [
        { id: "DT001", status: "Active" },
        { id: "DT002", status: "Active" },
        { id: "DT003", status: "Maintenance" }
      ]
    },
    {
      id: 2,
      name: "City Center Mall",
      dustbins: [
        { id: "CC001", status: "Active" },
        { id: "CC002", status: "Active" }
      ]
    },
    {
      id: 3,
      name: "Riverside Park",
      dustbins: [
        { id: "RP001", status: "Active" },
        { id: "RP002", status: "Maintenance" },
        { id: "RP003", status: "Active" },
        { id: "RP004", status: "Active" }
      ]
    }
  ];
  
  // Get available dustbins for the selected location
  const availableDustbins = React.useMemo(() => {
    if (!selectedLocation) return [];
    const location = locationData.find(loc => loc.id === selectedLocation);
    return location ? location.dustbins.filter(bin => bin.status === "Active") : [];
  }, [selectedLocation]);
  
  // Handle form submission
  const handleSubmit = () => {
    const selectedLocationName = locationData.find(loc => loc.id === selectedLocation)?.name;
    console.log({
      location: selectedLocationName,
      dustbinId: selectedDustbin,
      issue: text
    });
    // Show toast notification
    setShowToast(true);
    
    // Clear all fields
    setSelectedLocation(null);
    setSelectedDustbin(null);
    onChangeText('');
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Get appropriate button colors based on color scheme
  const getSubmitButtonStyle = () => {
    const baseStyle = styles.submitButton;
    const colorStyle = {
      backgroundColor: colorScheme === 'dark' ? '#1E88E5' : '#0D47A1'
    };
    
    return [baseStyle, colorStyle, (!selectedLocation || !selectedDustbin) && styles.disabledButton];
  };

  return (
    <SafeAreaProvider>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/dustbin.avif')}
            style={styles.headerImage}
            resizeMode="cover"
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Report Us</ThemedText>
          <HelloWave />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Location</ThemedText>
          <ThemedText>
            Make sure you allowed location permission.
          </ThemedText>
          
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowLocationDropdown(!showLocationDropdown)}
          >
            <ThemedText>
              {selectedLocation ? locationData.find(loc => loc.id === selectedLocation)?.name : "Select Location"}
            </ThemedText>
          </TouchableOpacity>
          
          {showLocationDropdown && (
            <View style={styles.dropdownList}>
              {locationData.map(location => (
                <TouchableOpacity 
                  key={location.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedLocation(location.id);
                    setSelectedDustbin(null);
                    setShowLocationDropdown(false);
                  }}
                >
                  <ThemedText>{location.name}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Dustbin ID</ThemedText>
          <ThemedText>
            can be found on the dustbin.
          </ThemedText>
          
          <TouchableOpacity 
            style={[
              styles.dropdownButton, 
              !selectedLocation && styles.disabledDropdown
            ]}
            disabled={!selectedLocation}
            onPress={() => selectedLocation && setShowDustbinDropdown(!showDustbinDropdown)}
          >
            <ThemedText>
              {selectedDustbin || "Select Dustbin ID"}
            </ThemedText>
          </TouchableOpacity>
          
          {showDustbinDropdown && (
            <View style={styles.dropdownList}>
              {availableDustbins.map(dustbin => (
                <TouchableOpacity 
                  key={dustbin.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedDustbin(dustbin.id);
                    setShowDustbinDropdown(false);
                  }}
                >
                  <ThemedText>{dustbin.id}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ThemedView>
        
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Describe your issue</ThemedText>
          <TextInput
            style={[
              styles.input,
              { color: colorScheme === 'dark' ? 'white' : 'black' }
            ]}
            onChangeText={onChangeText}
            value={text}
            multiline={true}
            numberOfLines={4}
            placeholder="I found the dustbin filled..."
            placeholderTextColor={colorScheme === 'dark' ? '#a0a0a0' : '#707070'}
          />
        </ThemedView>
        
        <TouchableOpacity 
          style={getSubmitButtonStyle()}
          disabled={!selectedLocation || !selectedDustbin}
          onPress={handleSubmit}
        >
          <ThemedText style={styles.submitButtonText}>Submit Report</ThemedText>
        </TouchableOpacity>
      </ParallaxScrollView>
      
      {showToast && (
        <View style={[
          styles.toast, 
          { backgroundColor: colorScheme === 'dark' ? '#2E7D32' : '#4CAF50' }
        ]}>
          <ThemedText style={styles.toastText}>
            Report submitted successfully!
          </ThemedText>
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginTop: 12,
    borderRadius: 4,
    textAlignVertical: 'top',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 12,
    marginTop: 8,
  },
  disabledDropdown: {
    opacity: 0.5,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginTop: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  toast: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  toastText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
