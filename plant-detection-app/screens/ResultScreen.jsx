import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNavBar from '../components/BottomNavBar';

export default function ResultsScreen({ route, navigation }) {
    const { analysis = {}, savedImagePath } = route.params || {};
    const [isFavorite, setIsFavorite] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const viewShotRef = useRef();

    const api = process.env.EXPO_PUBLIC_API_URL;
    const apiUrl = `${api}/plant/favorite/add`;

    const toggleFavorite = async () => {
        if (isFavoriteLoading || isFavorite) return;

        setIsFavoriteLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');

            if (!token) {
                Alert.alert(
                    'Authentication Required',
                    'Please sign in to add plants to favorites',
                    [{ text: 'OK', onPress: () => navigation.navigate('Profile') }]
                );
                return;
            }

            const plantDetails = {
                organ: analysis.organ || '',
                species: typeof analysis.species === 'object' ? analysis.species.common_name : analysis.species || '',
                common_names: analysis.common_names || [],
                scientific_name: analysis.scientific_name || '',
                image_url: savedImagePath || '',
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(plantDetails),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to add to favorites');
            }

            setIsFavorite(true);
            Alert.alert(
                'Added to Favorites',
                'This plant has been added to your favorites!',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Error adding to favorites:', error);
            Alert.alert(
                'Error',
                error.message || 'Failed to add to favorites. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            setIsSharing(true);

            if (!savedImagePath && !analysis) {
                Alert.alert('Nothing to share', 'No plant information available');
                return;
            }

            const uri = await captureRef(viewShotRef, {
                format: 'jpg',
                quality: 0.9,
            });

            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert('Sharing not available', 'Sharing is not supported on your device');
                return;
            }

            await Sharing.shareAsync(uri, {
                dialogTitle: 'Plant Identification Results',
                mimeType: 'image/jpeg',
                UTI: 'public.image',
            });

        } catch (error) {
            console.error('Sharing failed:', error);
            Alert.alert('Error', 'Failed to share plant details. Please try again.');
        } finally {
            setIsSharing(false);
        }
    };

    const captureRef = (ref, options) => {
        return new Promise((resolve, reject) => {
            ref.current.capture().then(uri => {
                resolve(uri);
            }).catch(error => {
                reject(error);
            });
        });
    };

    const renderImageContent = () => {
        if (savedImagePath) {
            return (
                <Image
                    source={{ uri: savedImagePath }}
                    style={styles.shareImage}
                    resizeMode="cover"
                />
            );
        }
        return (
            <View style={styles.noImageContainer}>
                <Ionicons name="leaf-outline" size={80} color="#4C956C" />
                <Text style={styles.noImageText}>Plant Image</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Hidden view for sharing */}
            <ViewShot
                ref={viewShotRef}
                style={styles.hiddenView}
                options={{ format: 'jpg', quality: 0.9 }}
            >
                {renderImageContent()}

                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.gradientBanner}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View style={styles.bannerContent}>
                        <Text style={styles.shareTitle}>
                            {analysis?.common_names?.[0] || 'Unknown Plant'}
                        </Text>
                        {analysis?.scientific_name && (
                            <Text style={styles.shareScientificName}>
                                {analysis.scientific_name}
                            </Text>
                        )}
                        <View style={styles.appBrandContainer}>
                            <Ionicons name="leaf" size={16} color="#4C956C" />
                            <Text style={styles.shareAppName}>PlantApp Discovery</Text>
                        </View>
                    </View>
                </LinearGradient>
            </ViewShot>

            {/* Visible content */}
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.screenTitle}>Plant Identification</Text>
                    <Text style={styles.screenSubtitle}>Detailed Analysis Results</Text>
                </View>

                {/* Action buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            isFavorite ? styles.favoritedButton : styles.favoriteButton,
                            (isFavoriteLoading || isFavorite) && styles.buttonDisabled
                        ]}
                        onPress={toggleFavorite}
                        disabled={isFavoriteLoading || isFavorite}
                    >
                        {isFavoriteLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <Ionicons
                                    name={isFavorite ? 'heart' : 'heart-outline'}
                                    size={20}
                                    color="white"
                                />
                                <Text style={styles.buttonText}>
                                    {isFavorite ? 'Favorited' : 'Favorite'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.shareButton,
                            isSharing && styles.buttonDisabled
                        ]}
                        onPress={handleShare}
                        disabled={isSharing}
                    >
                        {isSharing ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <Ionicons name="share-social-outline" size={20} color="white" />
                                <Text style={styles.buttonText}>Share</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Image preview */}
                <View style={styles.imageContainer}>
                    {savedImagePath ? (
                        <Image
                            source={{ uri: savedImagePath }}
                            style={styles.previewImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.previewPlaceholder}>
                            <Ionicons name="leaf-outline" size={60} color="#4C956C" />
                        </View>
                    )}
                </View>

                {/* Plant details */}
                <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Plant Details</Text>

                    <DetailRow label="Common Name" value={analysis?.common_names?.[0] || 'N/A'} />
                    <DetailRow label="Scientific Name" value={analysis?.scientific_name || 'N/A'} />
                    <DetailRow label="Organ" value={analysis?.organ || 'N/A'} />
                    <DetailRow
                        label="Species"
                        value={typeof analysis?.species === 'object'
                            ? analysis.species.common_name
                            : analysis?.species || 'N/A'}
                    />
                </View>
            </ScrollView>

            <BottomNavBar navigation={navigation} activeRoute="ResultsScreen" />
        </View>
    );
}

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 80,
    },

    // Header
    header: {
        marginBottom: 20,
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    screenSubtitle: {
        fontSize: 16,
        color: '#7F8C8D',
        marginTop: 4,
    },

    // Button row
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        flex: 1,
    },
    favoriteButton: {
        backgroundColor: '#4C956C',
    },
    favoritedButton: {
        backgroundColor: '#FF3B30',
    },
    shareButton: {
        backgroundColor: '#2C3E50',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },

    // Image containers
    imageContainer: {
        marginBottom: 24,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#EAFAF1',
    },
    previewImage: {
        width: '100%',
        height: 250,
    },
    previewPlaceholder: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Details section
    detailsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4C956C',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2C3E50',
    },
    detailValue: {
        fontSize: 16,
        color: '#566573',
        maxWidth: '60%',
        textAlign: 'right',
    },

    // Share view styling (hidden)
    hiddenView: {
        position: 'absolute',
        width: '100%',
        left: -1000,
    },
    shareImage: {
        width: '100%',
        height: 400,
    },
    noImageContainer: {
        width: '100%',
        height: 400,
        backgroundColor: '#EAFAF1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        marginTop: 16,
        fontSize: 20,
        color: '#4C956C',
        fontWeight: '500',
    },
    gradientBanner: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    bannerContent: {
        width: '100%',
    },
    shareTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    shareScientificName: {
        fontSize: 20,
        color: 'white',
        fontStyle: 'italic',
        marginBottom: 12,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    appBrandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    shareAppName: {
        fontSize: 14,
        color: '#4C956C',
        fontWeight: '600',
        marginLeft: 6,
    },
});