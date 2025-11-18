import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Force clear all authentication data
 * Call this to reset the app to clean state
 */
export const forceLogout = async () => {
  console.log('🔴 Force logout - clearing all auth data');
  
  try {
    // Clear all AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    console.log('Found keys:', keys);
    
    await AsyncStorage.multiRemove(keys);
    console.log('✅ All storage cleared');
    
    return true;
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
    return false;
  }
};

/**
 * Check what's currently in storage (for debugging)
 */
export const debugStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('📦 Storage keys:', keys);
    
    const items = await AsyncStorage.multiGet(keys);
    items.forEach(([key, value]) => {
      console.log(`  ${key}:`, value ? value.substring(0, 100) + '...' : 'null');
    });
    
    return items;
  } catch (error) {
    console.error('Error reading storage:', error);
    return [];
  }
};
