import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../constants/theme';

export default function DebugScreen() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState('');

  const testDirectAPI = async () => {
    try {
      setResult('Testing direct API call...\n');
      
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: email.trim(),
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      setResult(prev => prev + '\n✅ Success!\n' + JSON.stringify(response.data, null, 2));
      
      // Save token
      if (response.data.auth_token) {
        await AsyncStorage.setItem('@iotux_auth_token', response.data.auth_token);
        await AsyncStorage.setItem('@iotux_user_data', JSON.stringify(response.data));
        setResult(prev => prev + '\n\n✅ Token saved to storage');
      }
    } catch (error: any) {
      setResult(prev => prev + '\n\n❌ Error: ' + JSON.stringify({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      }, null, 2));
    }
  };

  const testGetMe = async () => {
    try {
      setResult('Testing /user/me endpoint...\n');
      
      const token = await AsyncStorage.getItem('@iotux_auth_token');
      setResult(prev => prev + '\nToken: ' + (token ? token.substring(0, 20) + '...' : 'NO TOKEN'));
      
      const response = await axios.get(`${API_BASE_URL}/user/me`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || '',
        },
        timeout: 10000,
      });
      
      setResult(prev => prev + '\n\n✅ Success!\n' + JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      setResult(prev => prev + '\n\n❌ Error: ' + JSON.stringify({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      }, null, 2));
    }
  };

  const clearStorage = async () => {
    await AsyncStorage.clear();
    setResult('✅ Storage cleared!');
    Alert.alert('Success', 'All storage data cleared');
  };

  const checkStorage = async () => {
    const token = await AsyncStorage.getItem('@iotux_auth_token');
    const userData = await AsyncStorage.getItem('@iotux_user_data');
    
    setResult(
      'Current Storage:\n\n' +
      'Token: ' + (token ? token.substring(0, 50) + '...' : 'NONE') + '\n\n' +
      'User Data: ' + (userData || 'NONE')
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔧 API Debug Tool</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ⚠️ If you're seeing 401 errors, click "Clear Storage" first, then try login again.
        </Text>
      </View>
      
      <Text style={styles.label}>API Base URL:</Text>
      <Text style={styles.url}>{API_BASE_URL}</Text>
      
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={testDirectAPI}>
        <Text style={styles.buttonText}>Test Login API</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testGetMe}>
        <Text style={styles.buttonText}>Test /user/me</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={checkStorage}>
        <Text style={styles.buttonText}>Check Storage</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={clearStorage}>
        <Text style={styles.buttonText}>Clear Storage</Text>
      </TouchableOpacity>
      
      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Result:</Text>
        <ScrollView style={styles.resultScroll}>
          <Text style={styles.resultText}>{result}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  infoText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  url: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#6366F1',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultScroll: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
