import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';

const FavoriteScreen = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const api = process.env.EXPO_PUBLIC_API_URL;
    const apiUrl = `${api}/plant/favorite/get_all`;

    const fetchFavorites = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                console.log("auth not found!");
                navigation.navigate('Login');
                return;
            }
            const response = await fetch(apiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Printing the Data for the favorites screen!!")
            console.log(data)
            if (data) {
                const formattedData = data?.map(item => ({
                    id: item._id,
                    name: item.plant_data.common_names[0], // Taking first common name
                    scientific_name: item.plant_data.scientific_name,
                    image: item.plant_data.image_url
                        ? { uri: item.plant_data.image_url }
                        : require('../assets/images/plant.jpg'),
                    date_added: `Added ${new Date(item.added_at).toLocaleDateString()}`
                })) || [];
                setFavorites(formattedData);
            } else {
                setError('Failed to fetch favorites');
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setError(error.message);
            if (error.message.includes('401')) {
                navigation.navigate('Login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const removeFavorite = async (id) => {
        Alert.alert(
            'Remove Favorite',
            'Are you sure you want to remove this plant from favorites?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove', style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('userToken');
                            const deleteUrl = `${api}/plant/favorite/remove/${id}`;
                            const response = await fetch(deleteUrl, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            console.log(token)
                            if (!response.ok) {
                                throw new Error('Failed to remove favorite');
                            }
                            setFavorites(favorites.filter(item => item.id !== id));
                            Alert.alert('Success', 'Removed from favorites');
                        } catch (error) {
                            console.error('Error removing favorite:', error);
                            Alert.alert('Error', 'Failed to remove favorite');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.plantName}>{item.name}</Text>
                <Text style={styles.scientificName}>{item.scientific_name}</Text>
                <Text style={styles.dateAdded}>{item.date_added}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.favoriteButton}>
                <FontAwesome name="heart" size={24} color="#e74c3c" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Garden</Text>
            <Text style={styles.subtitle}>Your Favorites</Text>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2ecc71" />
                </View>
            ) : error ? (
                <View style={styles.emptyContainer}>
                    <FontAwesome name="exclamation-circle" size={60} color="#e74c3c" />
                    <Text style={styles.emptyText}>Error loading favorites</Text>
                    <Text style={styles.emptySubtext}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            setLoading(true);
                            setError(null);
                            fetchFavorites();
                        }}
                    >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            ) : favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <FontAwesome name="heart-o" size={60} color="#95a5a6" />
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <Text style={styles.emptySubtext}>Start adding plants to see them here</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {/* Bottom Navigation Bar */}
            {/* <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate('ScanAPlant')}
                >
                    <Ionicons name="camera" size={26} color="white" />
                    <Text style={styles.navButtonText}>Scan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, styles.activeNavButton]}
                    onPress={() => navigation.navigate('FavoriteScreen')}
                >
                    <Ionicons name="star-outline" size={26} color="#4CAF50" />
                    <Text style={styles.navButtonText}>Favorites</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate('ProfileScreen')}
                >
                    <FontAwesome name="user-o" size={24} color="white" />
                    <Text style={styles.navButtonText}>Profile</Text>
                </TouchableOpacity>
            </View> */}

            <BottomNavBar navigation={navigation} activeRoute="FavoriteScreen" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },
    title: {

        fontSize: 32,
        color: '#333',
        fontWeight: '800',
        marginBottom: 0,
        marginTop: 30,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(0,0,0,0.7)',
        marginBottom: 10,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#2c3e50',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 8,
        textAlign: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100, // Space for nav bar
        top: 40
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        elevation: 2,
    },
    cardImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    cardContent: {
        flex: 1,
        marginLeft: 16,
    },
    plantName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    scientificName: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 4,
    },
    dateAdded: {
        fontSize: 12,
        color: '#27ae60',
        marginTop: 8,
    },
    favoriteButton: {
        padding: 8,
    },
    retryButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#2ecc71',
        borderRadius: 5,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
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

export default FavoriteScreen;
