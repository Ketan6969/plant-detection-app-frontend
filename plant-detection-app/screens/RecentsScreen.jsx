import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecentsScreen = ({ navigation }) => {
    const [recents, setRecents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const api = process.env.EXPO_PUBLIC_API_URL;
    const apiUrl = `${api}/plant/get_recents`;

    console.log(`Consoling the API URL ${apiUrl}`)

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

    const renderRecentItem = ({ item }) => (
        <TouchableOpacity
            style={styles.recentItem}
            onPress={() => navigation.navigate('PlantDetail', { scanId: item._id })}
        >
            <View style={styles.imagePlaceholder}>
                <Ionicons name="leaf" size={30} color="#4CAF50" />
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
            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
    );

    const handleRefresh = () => {
        setLoading(true);
        setError(null);
        fetchRecents();
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/plant.jpg')}
                style={styles.background}
                blurRadius={5}
            >
                <View style={styles.overlay} />
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Recent Scans</Text>
                    <Text style={styles.subtitle}>Your plant identification history</Text>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="warning" size={40} color="#FF5252" />
                            <Text style={styles.errorText}>Failed to load recents</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={handleRefresh}
                            >
                                <Text style={styles.retryButtonText}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    ) : loading ? (
                        <View style={styles.loadingContainer}>
                            <Ionicons name="leaf" size={40} color="#4CAF50" />
                            <Text style={styles.loadingText}>Loading your scans...</Text>
                        </View>
                    ) : recents.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="time-outline" size={40} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.emptyText}>No scans recorded yet</Text>
                            <TouchableOpacity
                                style={styles.scanButton}
                                onPress={() => navigation.navigate('CameraScreen')}
                            >
                                <Ionicons name="scan" size={24} color="white" />
                                <Text style={styles.scanButtonText}>Scan Your First Plant</Text>
                            </TouchableOpacity>
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
        paddingHorizontal: 20,
        paddingTop: 50,
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
        marginBottom: 30,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    recentInfo: {
        flex: 1,
    },
    recentName: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    metaContainer: {
        flexDirection: 'row',
    },
    recentDate: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        marginRight: 10,
    },
    recentTime: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
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
        color: 'rgba(255,255,255,0.7)',
        fontSize: 18,
        marginTop: 15,
        marginBottom: 30,
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'white',
        marginTop: 15,
        fontSize: 16,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#FF5252',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});

export default RecentsScreen;