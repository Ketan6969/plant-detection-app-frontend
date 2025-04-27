import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const RecentItem = ({ item }) => {
    const [imageError, setImageError] = useState(false);
    console.log(item.identified_plant)
    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <View style={styles.recentItem}>
            <View style={styles.imagePlaceholder}>
                <Image
                    source={imageError ? require('../assets/images/leaf-icon.png') : { uri: item.image_url }}
                    style={styles.image}
                    onError={handleImageError}
                />
            </View>
            <View style={styles.recentInfo}>
                <Text style={styles.recentName}>{item.identified_plant}</Text>

                <View style={styles.metaContainer}>
                    <Text style={styles.recentDate}>
                        {new Date(item.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </Text>
                    <Text style={styles.recentTime}>
                        {new Date(item.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const RecentsScreen = ({ navigation }) => {
    const [recents, setRecents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const api = process.env.EXPO_PUBLIC_API_URL;
    const apiUrl = `${api}/plant/get_recents`;

    useEffect(() => {
        fetchRecents();
    }, []);

    const fetchRecents = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                navigation.navigate('Login');
                return;
            }

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    await AsyncStorage.removeItem('userToken');
                    navigation.navigate('Login');
                    return;
                }
                throw new Error(`Failed to load recents: ${response.status}`);
            }

            const data = await response.json();
            setRecents(data);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderRecentItem = ({ item }) => {
        return <RecentItem item={item} />;
    };

    const handleRefresh = () => {
        setLoading(true);
        setError(null);
        fetchRecents();
    };

    return (
        <LinearGradient
            colors={['#e0f7fa', '#ffffff', '#e0f7fa']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Recent Scans</Text>
                <Text style={styles.subtitle}>Your plant identification history</Text>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Failed to load recents</Text>
                    </View>
                ) : loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading your scans...</Text>
                    </View>
                ) : recents.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No scans recorded yet</Text>
                    </View>
                ) : (
                    <FlatList
                        data={recents}
                        renderItem={renderRecentItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        refreshing={loading}
                        onRefresh={handleRefresh}
                    />
                )}
            </View>

            <BottomNavBar navigation={navigation} activeRoute="RecentsScreen" />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 32,
        color: '#333',
        fontWeight: '800',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(0,0,0,0.7)',
        marginBottom: 30,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    recentInfo: {
        flex: 1,
    },
    recentName: {
        color: '#333',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    metaContainer: {
        flexDirection: 'row',
    },
    recentDate: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 14,
        marginRight: 10,
    },
    recentTime: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#333',
        marginTop: 15,
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyText: {
        color: '#333',
        fontSize: 18,
        marginTop: 15,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#333',
        marginTop: 15,
        fontSize: 16,
    },
});

export default RecentsScreen;