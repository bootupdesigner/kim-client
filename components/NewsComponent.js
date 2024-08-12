import React, { useState, useEffect, useRef } from 'react';
import { View, Platform, Text, Linking, StyleSheet, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import axios from 'axios';

const NewsComponent = () => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('https://kim-server.onrender.com/news');
                setNewsData(response.data);
            } catch (error) {
                setError('Error fetching news data');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    useEffect(() => {
        if (newsData.length > 0) {
            const interval = setInterval(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % newsData.length);
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }).start();
                });
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [newsData, fadeAnim]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    const currentArticle = newsData[currentIndex];

    return (
        <ImageBackground
            source={{ uri: 'https://plus.unsplash.com/premium_photo-1674590090906-e3ed12522550?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
            style={styles.backgroundImage}
        >
            <View style={styles.overlay}>


                <Text style={styles.title}>Latest U.S. News</Text>
                <TouchableOpacity onPress={() => Linking.openURL(currentArticle.url)}>
                    <Animated.Text style={[styles.article, { opacity: fadeAnim }]}>
                        {currentArticle.title}
                    </Animated.Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        shadowColor: Platform.OS === 'web' || 'ios' ? '#00000090' : null,
        shadowOffset: {
            height: Platform.OS === 'web' || 'ios' ? 2 : null,
            width: Platform.OS === 'web' || 'ios' ? 2 : null
        },
        shadowRadius: Platform.OS === 'web' || 'ios' ? 3 : null,
        elevation: 3,
        marginVertical: 10
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0, 0.5)',
        justifyContent: 'center', 
        padding: 15,  
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color:'#fff',
    },
    article: {
        fontSize: 18,
        marginBottom: 10,
        color: '#fff',
        textDecorationLine: 'underline',
    },
    error: {
        color: 'red',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        shadowColor: Platform.OS === 'web' || 'ios' ? '#00000090' : null,
        shadowOffset: {
            height: Platform.OS === 'web' || 'ios' ? 2 : null,
            width: Platform.OS === 'web' || 'ios' ? 2 : null
        },
        shadowRadius: Platform.OS === 'web' || 'ios' ? 3 : null,
        elevation: 3,
        marginVertical: 15
    },
});

export default NewsComponent;
