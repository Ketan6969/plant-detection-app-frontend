import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; // using Expo vector icons, adjust if you're not using Expo!

const ScanAPlant = () => {
    return (
        <View style={styles.container}>
            {/* Blurred Background */}
            <ImageBackground
                source={require('../assets/images/plant.jpg')}  // replace with your plant image path
                style={styles.background}
                blurRadius={3}
            >
                {/* Circular Plant Preview */}
                <View style={styles.circleWrapper}>
                    <Image
                        source={require('../assets/images/plant2.jpg')}  // replace with your centered plant image
                        style={styles.plantImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Scan Text */}
                <Text style={styles.scanText}>Scan a Plant!</Text>
            </ImageBackground>

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomNav}>
                <TouchableOpacity>
                    <Ionicons name="camera-outline" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="star-outline" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <FontAwesome name="user-o" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleWrapper: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#00ADEF',
        overflow: 'hidden',
        marginBottom: 20,
    },
    plantImage: {
        width: '100%',
        height: '100%',
    },
    scanText: {
        fontSize: 26,
        color: 'white',
        fontWeight: 'bold',
        position: 'absolute',
        top: '55%',
    },
    bottomNav: {
        height: 70,
        backgroundColor: '#333',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});

export default ScanAPlant;
