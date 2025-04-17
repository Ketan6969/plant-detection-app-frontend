import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';


const Login = ({ navigation }) => {
    const api = process.env.EXPO_PUBLIC_API_URL;
    const apiUrl = `${api}/users/login`;
    const now = new Date().toISOString();  // Generates current ISO timestamp

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // const handleLogin = () => {
    //     if (email === 'admin' && password === 'admin') {
    //         navigation.navigate('ScanAPlant');
    //     } else {
    //         Alert.alert('Login Failed', 'Invalid username or password');
    //     }
    // };

    const handleLogin = async () => {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });

            const data = await response.json();
            console.log(typeof data)
            console.log(data)
            if (response.ok) {
                Alert.alert(
                    "Login Successful"
                    // `Token: ${data.access_token}`
                );
                navigation.navigate('ScanAPlant'); // Go back to login screen
            } else {
                console.log("else part")
                console.log(data)
                Alert.alert('Login Failed', data.detail || 'Please try again');
            }
        } catch (error) {
            console.log("error part")
            console.error(error);

            Alert.alert('Network Error', 'Please check your connection!');
        }

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to your account</Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={email}
                onChangeText={setEmail}

            />
            <TextInput
                placeholder="Password"
                placeholderTextColor="#aaa"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
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

export default Login;
