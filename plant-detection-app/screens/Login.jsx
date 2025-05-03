import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Eye, EyeOff } from 'lucide-react-native'; // added import
import { validateEmail, validatePassword } from '../utils/validator';


const Login = ({ navigation }) => {
    const api = process.env.EXPO_PUBLIC_API_URL;
    const apiUrl = `${api}/users/login`;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // added toggle state
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    });

    // useEffect(() => {
    //     const checkLoginStatus = async () => {
    //         try {
    //             const token = await AsyncStorage.getItem('userToken');
    //             if (token) {
    //                 navigation.navigate('ScanAPlant');
    //             }
    //         } catch (e) {
    //             console.log('Failed to fetch token', e);
    //         }
    //     };

    //     checkLoginStatus();
    // }, []);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    // Check if token is expired
                    const isExpired = isTokenExpired(token);
                    if (!isExpired) {
                        navigation.navigate('ScanAPlant');
                    } else {
                        // Optional: Remove expired token
                        await AsyncStorage.removeItem('userToken');
                    }
                }
            } catch (e) {
                console.log('Failed to fetch token', e);
            }
        };

        // Helper function to check token expiration
        const isTokenExpired = (token) => {
            try {
                // Decode the token (without verification)
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp) {
                    // Compare expiration time with current time
                    return payload.exp < Date.now() / 1000;
                }
                // If no expiration time, assume it's expired
                return true;
            } catch (e) {
                console.log('Failed to decode token', e);
                return true; // If there's an error, treat as expired
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

        const emailError = validateEmail(email.trim());
        const passwordError = validatePassword(password);

        if (emailError) {
            newErrors.email = emailError;
            valid = false;
        }

        if (passwordError) {
            newErrors.password = passwordError;
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
                headers: { 'Content-Type': 'application/json' },
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

            {/* Password input with Eye toggle */}
            <View style={{ width: '100%', position: 'relative' }}>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor={styles.placeholder.color}
                    style={[styles.input, errors.password && styles.errorInput]}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setErrors(prev => ({ ...prev, password: '' }));
                    }}
                />
                <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(prev => !prev)}
                >
                    {showPassword ? (
                        <EyeOff color="#666" size={22} />
                    ) : (
                        <Eye color="#666" size={22} />
                    )}
                </TouchableOpacity>
            </View>
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
        paddingRight: 45, // extra space for the eye icon
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
    eyeButton: {
        position: 'absolute',
        right: 15,
        top: 18,
    },
});

export default Login;
