import { ImportIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import { validateName, validateEmail, validatePassword } from '../utils/validators';
import { validateEmail, validateName, validatePassword } from '../utils/validator';
const Signup = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        general: ''
    });

    const api = process.env.EXPO_PUBLIC_API_URL;
    const apiUrl = `${api}/users/create_user`;
    const now = new Date().toISOString();

    const validateForm = () => {
        let valid = true;
        const newErrors = { name: '', email: '', password: '', general: '' };

        // Name validation
        const nameError = validateName(name);
        if (nameError) {
            newErrors.name = nameError;
            valid = false;
        }

        // Email validation
        const emailError = validateEmail(email.trim());
        if (emailError) {
            newErrors.email = emailError;
            valid = false;
        }

        // Password validation
        const passwordError = validatePassword(password);
        if (passwordError) {
            newErrors.password = passwordError;
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors(prev => ({ ...prev, general: '' }));

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email: email.trim(), password, created_at: now, updated_at: now })
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors(prev => ({ ...prev, general: data.message || 'Signup failed. Please try again.' }));
                return;
            }

            navigation.navigate('Login'); // Navigate to Login on success
        } catch (error) {
            console.error(error);
            setErrors(prev => ({ ...prev, general: 'Network error. Please check your connection.' }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>

            {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

            <TextInput
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                style={[styles.input, errors.name && styles.errorInput]}
                onChangeText={(text) => {
                    setName(text);
                    setErrors(prev => ({ ...prev, name: '' }));
                }}
                value={name}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

            <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                style={[styles.input, errors.email && styles.errorInput]}
                onChangeText={(text) => {
                    setEmail(text);
                    setErrors(prev => ({ ...prev, email: '' }));
                }}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <TextInput
                placeholder="Password"
                placeholderTextColor="#aaa"
                style={[styles.input, errors.password && styles.errorInput]}
                secureTextEntry
                onChangeText={(text) => {
                    setPassword(text);
                    setErrors(prev => ({ ...prev, password: '' }));
                }}
                value={password}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>SIGN UP</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.switchText}>Already have an account? Log In</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    errorInput: {
        borderColor: '#e74c3c',
    },
    errorText: {
        color: '#e74c3c',
        alignSelf: 'flex-start',
        marginBottom: 15,
        marginTop: -5,
    },
    button: {
        backgroundColor: '#4CAF50',
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
        color: '#4CAF50',
        marginTop: 10,
    },
});

export default Signup;
