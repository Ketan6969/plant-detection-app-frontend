import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ResultsScreen({ route }) {
    const { analysis } = route.params;

    if (!analysis) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No data available.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Plant Identification</Text>
                <Text style={styles.subtitle}>Detailed Analysis Results</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Organ:</Text>
                        <Text style={styles.value}>{analysis.organ}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Species:</Text>
                        <Text style={styles.value}>{analysis.species}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Scientific Details</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Scientific Name:</Text>
                        <Text style={[styles.value, styles.scientificName]}>{analysis.scientific_name}</Text>
                    </View>
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
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F9FAF9',
        padding: 20,
    },
    header: {
        marginBottom: 25,
        alignItems: 'center',
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
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 25,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 3,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
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
        backgroundColor: '#D6E1D6',
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
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});