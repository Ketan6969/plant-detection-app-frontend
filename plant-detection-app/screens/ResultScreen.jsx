import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNavBar';

export default function ResultsScreen({ route, navigation }) {
    const { analysis } = route.params;
    const { savedImagePath } = route.params;
    console.log('savedImagePath:', savedImagePath);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const api = process.env.EXPO_PUBLIC_API_URL;
    const apiUrl = `${api}/plant/favorite/add`;

    const toggleFavorite = async () => {
        if (isLoading || isFavorite) return;

        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');

            if (!token) {
                Alert.alert(
                    'Authentication Required',
                    'Please sign in to add plants to favorites',
                    [{ text: 'OK' }]
                );
                return;
            }



            const plantDetails = {
                organ: analysis.organ || '',
                species: typeof analysis.species === 'object' ? analysis.species.common_name : analysis.species || '',
                common_names: analysis.common_names || [],
                scientific_name: analysis.scientific_name || ''
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(plantDetails)
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
            setIsLoading(false);
        }
    };

    if (!analysis) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No data available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Plant Identification</Text>
                    <Text style={styles.subtitle}>Detailed Analysis Results</Text>

                    <TouchableOpacity
                        style={[styles.favoriteButton, isFavorite && styles.favoritedButton]}
                        onPress={toggleFavorite}
                        disabled={isLoading || isFavorite}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#4C956C" />
                        ) : (
                            <>
                                <Ionicons
                                    name={isFavorite ? 'heart' : 'heart-outline'}
                                    size={24}
                                    color={isFavorite ? '#FF3B30' : '#4C956C'}
                                />
                                <Text style={[styles.favoriteText, { color: isFavorite ? '#FF3B30' : '#4C956C' }]}>
                                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    {savedImagePath ? (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: savedImagePath }}
                                style={styles.plantImage}
                                resizeMode="cover"
                                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                            />
                        </View>
                    ) : (
                        <View style={[styles.imageContainer, styles.imagePlaceholder]}>
                            <Ionicons name="leaf-outline" size={60} color="#4C956C" />
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Basic Information</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Organ:</Text>
                            <Text style={styles.value}>{analysis.organ || 'N/A'}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Species:</Text>
                            <Text style={styles.value}>
                                {typeof analysis.species === 'object'
                                    ? analysis.species.common_name
                                    : analysis.species || 'N/A'}
                            </Text>
                        </View>
                        {analysis.family && (
                            <View style={styles.row}>
                                <Text style={styles.label}>Family:</Text>
                                <Text style={styles.value}>{analysis.family}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Scientific Details</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Scientific Name:</Text>
                            <Text style={[styles.value, styles.scientificName]}>{analysis.scientific_name || 'N/A'}</Text>
                        </View>
                        {analysis.genus && (
                            <View style={styles.row}>
                                <Text style={styles.label}>Genus:</Text>
                                <Text style={styles.value}>{analysis.genus}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Common Names</Text>
                        {analysis.common_names && analysis.common_names.length > 0 ? (
                            <View style={styles.commonNamesContainer}>
                                {analysis.common_names.map((name, index) => (
                                    <View key={index} style={styles.commonNameTag}>
                                        <Text style={styles.commonNameText}>{name}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.value}>No common names found.</Text>
                        )}
                    </View>

                    {analysis.description && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Description</Text>
                                <Text style={styles.descriptionText}>{analysis.description}</Text>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
            <BottomNavBar navigation={navigation} activeRoute="ResultsScreen" />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F9FAF9',
    },
    container: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 80, // Added padding to prevent content from being hidden behind nav bar
    },
    header: {
        marginBottom: 25,
        alignItems: 'center',
        top: 20
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2E2E2E',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#4C956C',
        marginBottom: 15,
    },
    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F7F4',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    favoritedButton: {
        backgroundColor: '#FFEBEE',
    },
    favoriteText: {
        marginLeft: 10,
        fontWeight: '600',
        fontSize: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 25,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 15,
        elevation: 5,
        marginBottom: 20,
        bottom: -10
    },
    imageContainer: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    imagePlaceholder: {
        backgroundColor: '#E8F4EA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plantImage: {
        width: '100%',
        height: '100%',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4C956C',
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2E2E2E',
        flex: 1,
    },
    value: {
        fontSize: 16,
        color: '#555',
        flex: 1,
        textAlign: 'right',
    },
    scientificName: {
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: '#E8F4EA',
        marginVertical: 20,
    },
    commonNamesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    commonNameTag: {
        backgroundColor: '#B7E4C7',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    commonNameText: {
        color: '#2E2E2E',
        fontSize: 14,
    },
    descriptionText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});