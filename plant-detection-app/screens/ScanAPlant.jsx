import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    Animated,
    StatusBar,
    Platform,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { checkTokenExpiration } from '../utils/auth';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const ScanAPlant = ({ navigation }) => {
    const [isScanning, setIsScanning] = useState(false);
    const scanAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Check authentication on component mount
        const verifyAuth = async () => {
            const isTokenValid = await checkTokenExpiration();
            if (!isTokenValid) {
                navigation.navigate("Login");
            }
        };
        verifyAuth();

        // Set status bar to light mode for better visibility on dark background
        StatusBar.setBarStyle('light-content');

        return () => {
            // Reset scan animation when component unmounts
            scanAnim.stopAnimation();
        };
    }, [navigation]);

    useEffect(() => {
        if (isScanning) {
            startScanAnimation();
        } else {
            scanAnim.stopAnimation();
        }
    }, [isScanning]);

    // Initialize scanning animation on component mount
    useEffect(() => {
        setIsScanning(true);
    }, []);

    const startScanAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true
                }),
                Animated.timing(scanAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true
                })
            ])
        ).start();
    };

    const animateButton = () => {
        // Haptic feedback for button press
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Button press animation
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            })
        ]).start();

        // Navigate to camera screen
        navigation.navigate('CameraScreen');
    };

    const translateY = scanAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200] // Increased range for more noticeable effect
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={require('../assets/images/plantpin.jpeg')}
                style={styles.background}
                blurRadius={6}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.4)', 'rgba(20, 61, 41, 0.7)']}
                    style={styles.overlay}
                />

                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Plant Scanner</Text>
                        <Text style={styles.subtitle}>Identify plants instantly with AI</Text>
                    </View>

                    <View style={styles.scanContainer}>
                        <View style={styles.plantImageContainer}>
                            <Image
                                source={require('../assets/images/plantbg.png')}
                                style={styles.plantImage}
                                resizeMode="contain"
                            />
                            <Animated.View
                                style={[
                                    styles.scanLine,
                                    {
                                        transform: [{ translateY }],
                                        opacity: scanAnim
                                    }
                                ]}
                            />
                        </View>

                        <View style={styles.instructionsContainer}>
                            <Text style={styles.instructionTitle}>How to scan:</Text>
                            <View style={styles.instructionItem}>
                                <Ionicons name="camera-outline" size={22} color="#4CAF50" />
                                <Text style={styles.instructionText}>Point camera at a leaf or flower</Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <Ionicons name="sunny-outline" size={22} color="#4CAF50" />
                                <Text style={styles.instructionText}>Ensure good lighting conditions</Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <Ionicons name="hand-left-outline" size={22} color="#4CAF50" />
                                <Text style={styles.instructionText}>Hold steady for 2-3 seconds</Text>
                            </View>
                        </View>
                    </View>

                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={animateButton}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#6BDA7A', '#4CAF50', '#3d8b40']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="scan-outline" size={22} color="white" />
                                <Text style={styles.scanButtonText}>Scan a Plant Now</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <BottomNavBar navigation={navigation} activeRoute="ScanAPlant" />
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 10 : 50,
        paddingBottom: 30,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 36,
        color: 'white',
        fontWeight: '700',
        marginBottom: 8,
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
    },
    scanContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
    },
    plantImageContainer: {
        width: width * 0.85,
        height: 230,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    plantImage: {
        width: '80%',
        height: '100%',
        borderRadius: 12,
        marginBottom: 20
    },
    scanLine: {
        position: 'absolute',
        width: '85%',
        height: 3,
        backgroundColor: '#5BDA7A',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    instructionsContainer: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    instructionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    instructionText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        marginLeft: 12,
        flex: 1,
    },
    scanButton: {
        borderRadius: 25,
        overflow: 'hidden',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
        marginBottom: Platform.OS === 'ios' ? 20 : -10,
        alignSelf: 'center',
        width: width * 0.65,
    },
    buttonGradient: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    scanButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    }
});

export default ScanAPlant;