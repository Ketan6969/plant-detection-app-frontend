import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';
import { jwtDecode } from 'jwt-decode';

const ProfileScreen = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({ name: '', email: '' });
    const navigation = useNavigation();
    const api = process.env.EXPO_PUBLIC_API_URL;
    const apiUrl = `${api}/plant/favorite/get_all`;

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                navigation.navigate('Login');
                return;
            }

            const decoded = jwtDecode(token);
            setUserData({
                name: decoded.name || 'User',
                email: decoded.email || ''
            });
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    };

    const fetchFavorites = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
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
            const formattedData = data?.map(item => ({
                id: item._id,
                name: item.plant_data.common_names[0],
                scientific_name: item.plant_data.scientific_name,
                image: item.plant_data.image_url
                    ? { uri: item.plant_data.image_url }
                    : require('../assets/images/plant.jpg'),
                date_added: `Added ${new Date(item.added_at).toLocaleDateString()}`
            })) || [];

            setFavorites(formattedData);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Logout',
                    onPress: async () => {
                        await AsyncStorage.removeItem('userToken');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }
            ]
        );
    };

    useEffect(() => {
        fetchUserData();
        fetchFavorites();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.favoriteCard}>
            <Image source={item.image} style={styles.favoriteImage} />
            <View style={styles.favoriteContent}>
                <Text style={styles.favoriteName}>{item.name}</Text>
                <Text style={styles.favoriteScientific}>{item.scientific_name}</Text>
                <View style={styles.dateContainer}>
                    <Feather name="calendar" size={14} color="#95a5a6" />
                    <Text style={styles.dateAdded}>{item.date_added}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons name="heart" size={20} color="#e74c3c" />
            </TouchableOpacity>
        </View>
    );

    const renderProfileImage = () => {
        if (userData.name) {
            const firstLetter = userData.name.charAt(0).toUpperCase();
            return (
                <View style={styles.profileImageContainer}>
                    <Text style={styles.profileImageText}>{firstLetter}</Text>
                </View>
            );
        }
        return (
            <Image
                source={require('../assets/images/plant5.jpg')} // Placeholder default image
                style={styles.profileImage}
            />
        );
    };

    return (
        <View style={styles.container}>
            {/* Header with gradient background */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    {renderProfileImage()}
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userData.name}</Text>
                        <Text style={styles.userEmail}>{userData.email}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <MaterialIcons name="logout" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stats Section */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>42</Text>
                    <Text style={styles.statLabel}>Scans</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{favorites.length}</Text>
                    <Text style={styles.statLabel}>Favorites</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>15</Text>
                    <Text style={styles.statLabel}>Identified</Text>
                </View>
            </View>

            {/* Favorites Section */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Favorite Plants</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#2ecc71" style={styles.loader} />
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Ionicons name="warning" size={40} color="#e74c3c" />
                    <Text style={styles.errorText}>Failed to load favorites</Text>
                </View>
            ) : favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="leaf-outline" size={60} color="#bdc3c7" />
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <Text style={styles.emptySubtext}>Your favorite plants will appear here</Text>
                    <TouchableOpacity style={styles.scanButton}>
                        <Text style={styles.scanButtonText}>Scan Your First Plant</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={favorites.slice(0, 5)}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.favoriteList}
                    scrollEnabled={false}
                />
            )}

            <BottomNavBar navigation={navigation} activeRoute="ProfileScreen" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 30,
        backgroundColor: '#2ecc71',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImageContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#7f8c8d',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
    },
    userInfo: {
        flex: 1,
        marginLeft: 15,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: 'white',
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    logoutButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: -20,
        marginHorizontal: 20,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        zIndex: 1,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2c3e50',
    },
    statLabel: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 30,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2c3e50',
    },
    seeAllText: {
        fontSize: 14,
        color: '#2ecc71',
        fontWeight: '600',
    },
    favoriteList: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    favoriteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    favoriteImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    favoriteContent: {
        flex: 1,
        marginLeft: 15,
    },
    favoriteName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
    },
    favoriteScientific: {
        fontSize: 13,
        color: '#7f8c8d',
        marginTop: 2,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    dateAdded: {
        fontSize: 12,
        color: '#95a5a6',
        marginLeft: 5,
    },
    favoriteButton: {
        padding: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#95a5a6',
        marginTop: 5,
        textAlign: 'center',
        marginHorizontal: 40,
    },
    scanButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#2ecc71',
        borderRadius: 25,
    },
    scanButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    errorText: {
        fontSize: 16,
        color: '#e74c3c',
        marginTop: 15,
    },
    loader: {
        marginTop: 40,
    },
});

export default ProfileScreen;
