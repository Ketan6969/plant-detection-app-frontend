import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    // Sample user data
    const user = {
        name: "Alex Green",
        email: "alex.green@example.com",
        joinDate: "Joined May 2023",
        plantsIdentified: 42,
        avatar: require('../assets/images/plant.jpg'), // Your path may vary
        favoritePlants: [
            { id: 1, name: "Monstera Deliciosa", sciName: "Monstera deliciosa" },
            { id: 2, name: "Rubber Plant", sciName: "Ficus elastica" },
            { id: 3, name: "Snake Plant", sciName: "Sansevieria trifasciata" }
        ]
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity style={styles.settingsButton}>
                    <Ionicons name="settings-outline" size={24} color="#4C956C" />
                </TouchableOpacity>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
                <Image source={user.avatar} style={styles.avatar} />
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.joinDate}>{user.joinDate}</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{user.plantsIdentified}</Text>
                        <Text style={styles.statLabel}>Plants ID'd</Text>
                    </View>
                </View>
            </View>

            {/* Favorites Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Favorite Plants</Text>
                {user.favoritePlants.map(plant => (
                    <TouchableOpacity key={plant.id} style={styles.plantCard}>
                        <View style={styles.plantInfo}>
                            <Text style={styles.plantName}>{plant.name}</Text>
                            <Text style={styles.plantSciName}>{plant.sciName}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#D6E1D6" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* App Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="notifications-outline" size={20} color="#4C956C" />
                    <Text style={styles.settingText}>Notification Preferences</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="lock-closed-outline" size={20} color="#4C956C" />
                    <Text style={styles.settingText}>Privacy Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="help-circle-outline" size={20} color="#4C956C" />
                    <Text style={styles.settingText}>Help & Support</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F9FAF9',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E2E2E',
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#D6E1D6',
        marginBottom: 15,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E2E2E',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    joinDate: {
        fontSize: 12,
        color: '#4C956C',
        marginBottom: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#6BBF59',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4C956C',
        marginBottom: 15,
    },
    plantCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    plantInfo: {
        flex: 1,
    },
    plantName: {
        fontSize: 16,
        color: '#2E2E2E',
        marginBottom: 2,
    },
    plantSciName: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    settingText: {
        fontSize: 16,
        color: '#2E2E2E',
        marginLeft: 10,
    },
});

export default ProfileScreen;