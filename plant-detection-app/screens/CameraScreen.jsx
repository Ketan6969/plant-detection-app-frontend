import React, { useState, useRef } from 'react';
import {
    CameraView,
    useCameraPermissions
} from 'expo-camera';
import {
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen({ navigation }) {
    const [facing, setFacing] = useState('back');
    const [flash, setFlash] = useState('off');
    const [permission, requestPermission] = useCameraPermissions();
    const [capturedImage, setCapturedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const cameraRef = useRef(null);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Ionicons name="camera" size={80} color="#fff" />
                <Text style={styles.permissionText}>We need your permission to access the camera</Text>
                <Button
                    onPress={requestPermission}
                    title="Grant Permission"
                    color="#4a90e2"
                />
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const toggleFlash = () => {
        setFlash(current => {
            if (current === 'off') return 'on';
            if (current === 'on') return 'auto';
            return 'off';
        });
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                skipProcessing: true,
            });
            setCapturedImage(photo.uri);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'We need access to your photos to select an image');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setCapturedImage(result.assets[0].uri);
        }
    };

    const retakePicture = () => {
        setCapturedImage(null);
    };

    const sendImageToAPI = async () => {
        setIsUploading(true);
        try {
            // Get the stored JWT token
            const token = await AsyncStorage.getItem('userToken');

            if (!token) {
                Alert.alert('Authentication required', 'Please login to use this feature');
                navigation.navigate('Login');
                return;
            }

            // Create FormData to send the image
            const formData = new FormData();
            formData.append('file', {
                uri: capturedImage,
                name: 'plant_photo.jpg',
                type: 'image/jpeg'
            });

            // Add timestamp if needed
            // formData.append('timestamp', new Date().toISOString());

            const api = process.env.EXPO_PUBLIC_API_URL;
            const response = await fetch(`${api}/plant`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data',
                },
                body: formData
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to upload image');
            }

            // Handle successful response
            Alert.alert('Success', 'Image uploaded successfully!');
            navigation.navigate('ResultsScreen', { analysis: responseData });

        } catch (error) {
            console.error('Upload error:', error);

            // Handle expired token
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                Alert.alert(
                    'Session Expired',
                    'Please login again',
                    [
                        {
                            text: 'OK',
                            onPress: async () => {
                                await AsyncStorage.removeItem('userToken');
                                navigation.navigate('Login');
                            }
                        }
                    ]
                );
            } else {
                Alert.alert('Error', error.message || 'Failed to upload image');
            }
        } finally {
            setIsUploading(false);
        }
    };

    if (capturedImage) {
        return (
            <View style={styles.previewContainer}>
                <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                <View style={styles.previewButtons}>
                    <TouchableOpacity
                        style={styles.previewButton}
                        onPress={retakePicture}
                        disabled={isUploading}
                    >
                        <Ionicons name="camera-reverse" size={30} color="#fff" />
                        <Text style={styles.previewButtonText}>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.previewButton}
                        onPress={sendImageToAPI}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle" size={30} color="#fff" />
                                <Text style={styles.previewButtonText}>Use Photo</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
                flash={flash}
            >
                {/* Top controls */}
                <View style={styles.topControls}>
                    <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
                        <Ionicons
                            name={flash === 'on' ? 'flash' : flash === 'auto' ? 'flash-auto' : 'flash-off'}
                            size={30}
                            color="#fff"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                        <MaterialIcons name="photo-library" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Center overlay */}
                <View style={styles.overlay}>
                    <View style={styles.overlayFrame} />
                    <Text style={styles.overlayText}>Align your subject within the frame</Text>
                </View>

                {/* Bottom controls */}
                <View style={styles.bottomControls}>
                    <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                        <Ionicons name="camera-reverse" size={30} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                        <View style={styles.captureButtonInner} />
                    </TouchableOpacity>

                    <View style={styles.placeholder} />
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 20,
    },
    camera: {
        flex: 1,
    },
    topControls: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    flashButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 50,
    },
    galleryButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 50,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayFrame: {
        width: 250,
        height: 350,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 10,
        backgroundColor: 'transparent',
    },
    overlayText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
        borderRadius: 10,
    },
    bottomControls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    flipButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 15,
        borderRadius: 50,
    },
    captureButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 5,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    placeholder: {
        width: 30,
    },
    previewContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    previewImage: {
        flex: 1,
        resizeMode: 'contain',
    },
    previewButtons: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    previewButton: {
        alignItems: 'center',
        padding: 15,
    },
    previewButtonText: {
        color: '#fff',
        marginTop: 5,
        fontSize: 16,
    },
});