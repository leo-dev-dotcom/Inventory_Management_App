import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeStorageData = async (storageKey: string, data: any) => {
  try {
    return await AsyncStorage.setItem(storageKey, JSON.stringify(data));
  } catch (e) {
    console.log(e);
    throw e;
  }
};
export const getStorageData = async (storageKey: string) => {
  try {
    const value = await AsyncStorage.getItem(storageKey);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
    throw error;
  }
};
export const clearStorageData = async (storageKey: string) => {
  try {
    await AsyncStorage.removeItem(storageKey);
  } catch (error) {
    console.error(`Error clearing AsyncStorage key "${storageKey}":`, error);
    throw error;
  }
};

export const getUserRole = async () => {
  try {
    const userData = await AsyncStorage.getItem('isLoggedIn');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      return parsedUserData.role || null;
    }
    return null; // Return null if user data or role is not found
  } catch (error) {
    console.error('Error retrieving user role from AsyncStorage:', error);
    throw error;
  }
};
