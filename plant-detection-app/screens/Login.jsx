import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
    const api = process.env.EXPO_PUBLIC_API_URL;
    const apiUrl = `${api}/users/login`;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    });

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

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            email: '',
            password: '',
            general: ''
        };

        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email';
            valid = false;
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors(prev => ({ ...prev, general: '' }));

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
                throw new Error(data.detail || 'Login failed. Please check your credentials and try again.');
            }

            const tokenData = Array.isArray(data) ? data[0] : data;

            if (!tokenData.access_token) {
                throw new Error('No access token received');
            }

            // Store token
            await AsyncStorage.multiSet([
                ['userToken', tokenData.access_token],
            ]);

            navigation.replace('ScanAPlant');
        } catch (error) {
            console.error('Login error:', error);
            setErrors(prev => ({ ...prev, general: error.message }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to your account</Text>

            {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

            <TextInput
                placeholder="Email"
                placeholderTextColor={styles.placeholder.color}
                style={[styles.input, errors.email && styles.errorInput]}
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setErrors(prev => ({ ...prev, email: '' }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <TextInput
                placeholder="Password"
                placeholderTextColor={styles.placeholder.color}
                style={[styles.input, errors.password && styles.errorInput]}
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    setErrors(prev => ({ ...prev, password: '' }));
                }}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

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
        backgroundColor: '#F9FAF9',
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#2E2E2E',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#4C956C',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#D6E1D6',
    },
    errorInput: {
        borderColor: '#e74c3c',
    },
    placeholder: {
        color: '#aaa',
    },
    button: {
        backgroundColor: '#6BBF59',
        paddingVertical: 15,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    switchText: {
        color: '#4C956C',
        marginTop: 10,
    },
    errorText: {
        color: '#e74c3c',
        alignSelf: 'flex-start',
        marginBottom: 15,
        marginTop: -5,
    },
});

export default Login;