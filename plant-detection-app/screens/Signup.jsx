
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Signup = ({ navigation }) => {
    // Handle sign up
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const api = process.env.EXPO_PUBLIC_API_URL; // Exporting the env from the .env
    const apiUrl = `${api}/users/create_user`;
    const now = new Date().toISOString();  // Generates current ISO timestamp
    const handleSignup = async () => {
        // const apiUrl = apiUrl
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    created_at: now,
                    updated_at: now
                })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Signup Successful!', 'You can now log in.');
                navigation.navigate('Login'); // Go back to login screen
            } else {
                Alert.alert('Signup Failed', data.message || 'Please try again.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Network Error', 'Please check your connection!');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>

            <TextInput
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                style={styles.input}
                onChangeText={setName}
                value={name}
            />
            <TextInput
                placeholder="email"
                placeholderTextColor="#aaa"
                style={styles.input}
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor="#aaa"
                style={styles.input}
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>SIGN UP</Text>
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
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#4CAF50',
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
        color: '#4CAF50',
        marginTop: 10,
    },
});

export default Signup;
