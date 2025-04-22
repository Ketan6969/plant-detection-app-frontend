import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';

const ProfileScreen = () => {
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

    useEffect(() => {
        fetchFavorites();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.favoriteCard}>
            <Image source={item.image} style={styles.favoriteImage} />
            <View style={styles.favoriteContent}>
                <Text style={styles.favoriteName}>{item.name}</Text>
                <Text style={styles.favoriteScientific}>{item.scientific_name}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/images/plant.jpg')} style={styles.profileImage} />
                <Text style={styles.userName}>Your Name</Text>
                <Text style={styles.userEmail}>your@email.com</Text>
            </View>

            <Text style={styles.sectionTitle}>Favorite Plants</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#27ae60" style={{ marginTop: 20 }} />
            ) : error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
            ) : favorites.length === 0 ? (
                <Text style={styles.emptyText}>No favorite plants yet.</Text>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.favoriteList}
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
                    style={styles.navButton}
                    onPress={() => navigation.navigate('FavoriteScreen')}
                >
                    <Ionicons name="star-outline" size={26} color="white" />
                    <Text style={styles.navButtonText}>Favorites</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, styles.activeNavButton]}
                    onPress={() => navigation.navigate('ProfileScreen')}
                >
                    <FontAwesome name="user-o" size={24} color="#4CAF50" />
                    <Text style={styles.navButtonText}>Profile</Text>
                </TouchableOpacity>
            </View> */}
            <BottomNavBar navigation={navigation} activeRoute="ProfileScreen" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ecf0f1' },
    header: { alignItems: 'center', padding: 20 },
    profileImage: { width: 100, height: 100, borderRadius: 50 },
    userName: { fontSize: 22, fontWeight: 'bold', marginTop: 10, color: '#2c3e50' },
    userEmail: { fontSize: 14, color: '#7f8c8d' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 16, marginTop: 20, color: '#2c3e50' },
    favoriteList: { padding: 16, paddingBottom: 100 },
    favoriteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, padding: 12, elevation: 2 },
    favoriteImage: { width: 60, height: 60, borderRadius: 8 },
    favoriteContent: { marginLeft: 16 },
    favoriteName: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
    favoriteScientific: { fontSize: 14, color: '#7f8c8d' },
    emptyText: { textAlign: 'center', marginTop: 20, color: '#7f8c8d' },
    errorText: { textAlign: 'center', marginTop: 20, color: '#e74c3c' },
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
    navButton: { alignItems: 'center', padding: 8, borderRadius: 20, width: '30%' },
    activeNavButton: { backgroundColor: 'rgba(76, 175, 80, 0.2)' },
    navButtonText: { color: 'white', fontSize: 12, marginTop: 5 },
});

export default ProfileScreen;
