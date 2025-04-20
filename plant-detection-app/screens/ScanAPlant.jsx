import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const ScanAPlant = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/plant.jpg')}
                style={styles.background}
                blurRadius={5}
            >
                {/* Semi-transparent overlay */}
                <View style={styles.overlay} />

                {/* Main Content */}
                <View style={styles.contentContainer}>
                    {/* Scan Prompt */}
                    <Text style={styles.title}>Discover Plants</Text>
                    <Text style={styles.subtitle}>Identify any plant with your camera</Text>

                    {/* Scan Target */}
                    <View style={styles.scanTarget}>
                        <View style={styles.circleOuter}>
                            <View style={styles.circleInner}>
                                <Image
                                    source={require('../assets/images/plant2.jpg')}
                                    style={styles.plantImage}
                                    resizeMode="cover"
                                />
                            </View>
                        </View>
                        <Text style={styles.scanHint}>Center the plant in the circle</Text>
                    </View>

                    {/* Scan Button */}
                    <TouchableOpacity
                        style={styles.scanButton}
                        onPress={() => navigation.navigate('CameraScreen')}
                    >
                        <Ionicons name="scan" size={24} color="white" />
                        <Text style={styles.scanButtonText}>Scan Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Navigation */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity
                        style={[styles.navButton, styles.activeNavButton]}
                        onPress={() => navigation.navigate('CameraScreen')}
                    >
                        <Ionicons name="camera" size={26} color="#4CAF50" />
                        <Text style={styles.navButtonText}>Scan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('FavoriteScreen')} >
                        <Ionicons name="star-outline" size={26} color="white" />
                        <Text style={styles.navButtonText}  >Favorites</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navButton}
                        onPress={() => navigation.navigate('ProfileScreen')}
                    >
                        <FontAwesome name="user-o" size={24} color="white" />
                        <Text style={styles.navButtonText}>Profile</Text>
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
        justifyContent: 'space-between',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginTop: 50,
    },
    title: {
        fontSize: 32,
        color: 'white',
        fontWeight: '800',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 40,
        textAlign: 'center',
    },
    scanTarget: {
        alignItems: 'center',
        marginBottom: 40,
    },
    circleOuter: {
        width: 240,
        height: 240,
        borderRadius: 120,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    circleInner: {
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 3,
        borderColor: '#FFF',
        overflow: 'hidden',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 10,
    },
    plantImage: {
        width: '100%',
        height: '100%',
    },
    scanHint: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        fontStyle: 'italic',
    },
    scanButton: {
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    scanButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    navButton: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
        width: '30%',
    },
    activeNavButton: {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
    },
    navButtonText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
    },
});

export default ScanAPlant;