import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const BottomNavBar = ({ navigation, activeRoute }) => {
    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity
                style={[
                    styles.navButton,
                    activeRoute === 'CameraScreen' && styles.activeNavButton
                ]}
                onPress={() => navigation.navigate('ScanAPlant')}
            >
                <Ionicons name="camera" size={26} color="#4CAF50" />
                <Text style={styles.navButtonText}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.navButton,
                    activeRoute === 'FavoriteScreen' && styles.activeNavButton
                ]}
                onPress={() => navigation.navigate('FavoriteScreen')}
            >
                <Ionicons name="star-outline" size={26} color="white" />
                <Text style={styles.navButtonText}>Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.navButton,
                    activeRoute === 'RecentsScreen' && styles.activeNavButton
                ]}
                onPress={() => navigation.navigate('RecentsScreen')}
            >
                <Ionicons name="time-outline" size={26} color="white" />
                <Text style={styles.navButtonText}>Recents</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.navButton,
                    activeRoute === 'ProfileScreen' && styles.activeNavButton
                ]}
                onPress={() => navigation.navigate('ProfileScreen')}
            >
                <FontAwesome name="user-o" size={24} color="white" />
                <Text style={styles.navButtonText}>Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    navButton: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
        width: '22%',
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

export default BottomNavBar;
