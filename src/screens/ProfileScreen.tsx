import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    StatusBar as RNStatusBar,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { AuroraWaves } from '../components/common/AuroraWaves';
import { Card } from '../components/common/Card';
import { BORDER_RADIUS, COLORS, FONT_SIZES, getThemedColors, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const themedColors = getThemedColors(isDark);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem('@iotux_user_data');
      const savedProfileImage = await AsyncStorage.getItem('@profile_image');
      
      if (userData) {
        const user = JSON.parse(userData);
        setName(user.name || '');
        setEmail(user.email || '');
      }
      
      if (savedProfileImage) {
        setProfileImage(savedProfileImage);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Failed to pick image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      // Get existing user data
      const userData = await AsyncStorage.getItem('@iotux_user_data');
      let user = userData ? JSON.parse(userData) : {};
      
      // Update with new values
      user.name = name.trim();
      if (email.trim()) {
        user.email = email.trim();
      }
      
      // Save updated user data
      await AsyncStorage.setItem('@iotux_user_data', JSON.stringify(user));
      
      // Save profile image separately
      if (profileImage) {
        await AsyncStorage.setItem('@profile_image', profileImage);
      }
      
      Alert.alert('Success', 'Profile updated successfully! 🎉', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: themedColors.background }]}>
        <Text style={{ color: themedColors.text, textAlign: 'center', marginTop: 50 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background }]}>
      <RNStatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Background Layer - only in dark mode */}
      {isDark && (
        <View style={StyleSheet.absoluteFill}>
          <AuroraWaves />
        </View>
      )}

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.backButton, { color: themedColors.text }]}>← Back</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: themedColors.text }]}>Edit Profile</Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Profile Image Section */}
          <View style={styles.imageSection}>
            <TouchableOpacity 
              style={styles.imageContainer} 
              onPress={pickImage}
              activeOpacity={0.7}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={[
                  styles.placeholderImage,
                  { 
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  }
                ]}>
                  <Text style={[styles.placeholderText, { color: themedColors.text }]}>
                    {name.charAt(0).toUpperCase() || '👤'}
                  </Text>
                </View>
              )}
              
              {/* Edit Icon Badge */}
              <View style={[
                styles.editBadge,
                { 
                  borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                }
              ]}>
                <BlurView 
                  intensity={50} 
                  tint={isDark ? 'light' : 'dark'} 
                  style={[
                    styles.editBadgeBlur,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }
                  ]}
                >
                  <Text style={styles.editIcon}>✏️</Text>
                </BlurView>
              </View>
            </TouchableOpacity>
            
            <Text style={[styles.imageHint, { color: themedColors.textSecondary }]}>
              Tap to change profile photo
            </Text>
          </View>

          {/* Form Section */}
          <Card style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themedColors.text }]}>Name</Text>
              <TextInput
                style={[styles.input, {
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  color: themedColors.text,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                }]}
                placeholder="Enter your name"
                placeholderTextColor={themedColors.textTertiary}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themedColors.text }]}>Email</Text>
              <TextInput
                style={[styles.input, {
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  color: themedColors.text,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                }]}
                placeholder="Enter your email"
                placeholderTextColor={themedColors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </Card>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.7}
          >
            <BlurView 
              intensity={80} 
              tint={isDark ? 'light' : 'dark'} 
              style={styles.saveButtonBlur}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Text>
            </BlurView>
          </TouchableOpacity>

          {/* Info Card */}
          <Card style={styles.infoCard}>
            <Text style={[styles.infoText, { color: themedColors.textSecondary }]}>
              💡 Your profile changes are saved locally. Backend integration is coming soon.
            </Text>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    overflow: 'hidden',
  },
  editBadgeBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 16,
  },
  imageHint: {
    fontSize: FONT_SIZES.sm,
  },
  formCard: {
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
  saveButton: {
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonBlur: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  infoCard: {
    padding: SPACING.md,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
});
