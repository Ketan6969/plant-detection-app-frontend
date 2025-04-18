import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
    const api = process.env.EXPO_PUBLIC_API_URL;
    const apiUrl = `${api}/users/login`;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if user is already logged in
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    navigation.navigate('ScanAPlant');
                }
            } catch (e) {
                console.log('Failed to fetch token', e);
            }
        };

        checkLoginStatus();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password: password,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Login failed. Please try again.');
            }

            // Store token and user data if available
            await AsyncStorage.multiSet([
                ['userToken', data.access_token],
                ['userEmail', email] // Optional: store user email for display
            ]);

            navigation.replace('ScanAPlant'); // Use replace to prevent going back to login
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
            Alert.alert('Login Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to your account</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TextInput
                placeholder="Email"
                placeholderTextColor={styles.placeholder.color}
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor={styles.placeholder.color}
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>LOGIN</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Signup')}
                disabled={isLoading}
            >
                <Text style={styles.switchText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAF9', // Primary Background
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#2E2E2E', // Neutral Text
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#4C956C', // Secondary Accent
        marginBottom: 30,
    },
    input: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#D6E1D6', // Muted Border/Dividers
    },
    placeholder: {
        color: '#aaa', // Slightly gray placeholder text
    },
    button: {
        backgroundColor: '#6BBF59', // Primary Accent (Green)
        paddingVertical: 15,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    switchText: {
        color: '#4C956C', // Secondary Accent
        marginTop: 10,
    },
    errorText: {
        color: '#e74c3c', // Keeping red for errors (not in theme but important for visibility)
        marginBottom: 15,
    },
});

export default Login;