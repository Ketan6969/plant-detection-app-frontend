import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const ScanAPlant = () => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/plant.jpg')}
                style={styles.background}
                blurRadius={3}
            >
                {/* Main Content (centered) */}
                <View style={styles.contentWrapper}>
                    <View style={styles.circleWrapper}>
                        <Image
                            source={require('../assets/images/plant2.jpg')}
                            style={styles.plantImage}
                            resizeMode="cover"
                        />
                    </View>
                    <Text style={styles.scanText}>Scan a Plant!</Text>
                </View>

                {/* Bottom Navbar (fixed at bottom) */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity style={styles.navButton}>
                        <Ionicons name="camera-outline" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navButton}>
                        <Ionicons name="star-outline" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navButton}>
                        <FontAwesome name="user-o" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
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
        justifyContent: 'center', // Centers main content vertically
        alignItems: 'center', // Centers main content horizontally
    },
    contentWrapper: {
        alignItems: 'center',
        marginTop: -50, // Adjust as needed
    },
    circleWrapper: {
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 3,
        borderColor: '#FFF',
        overflow: 'hidden',
        marginBottom: 25,
        shadowColor: '#00ADEF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    plantImage: {
        width: '100%',
        height: '100%',
    },
    scanText: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
    },
    bottomNav: {
        position: 'absolute', // Key change
        bottom: 0, // Stick to bottom
        left: 10,
        right: 10,
        height: 70,
        backgroundColor: 'rgba(51, 51, 51, 0.55)',
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20
    },
    navButton: {
        padding: 10,
    }
});

export default ScanAPlant;