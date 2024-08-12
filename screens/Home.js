// Home.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, ScrollView, Platform, StatusBar, SafeAreaView } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import WeatherInfo from '../components/WeatherInfo';
import NewsComponent from '../components/NewsComponent';
import RecipeSearch from '../components/RecipeSearch';

const Home = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const date = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = date.toLocaleDateString('en-US', options);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const response = await axios.get('https://kim-server.onrender.com/weather', {
          params: { lat, lon },
        });
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error.message || error);
        setError('Error fetching weather data');
      } finally {
        setLoading(false);
      }
    };

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let locationOptions = {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000,
        distanceInterval: 1,
      };

      let { coords } = await Location.getCurrentPositionAsync(locationOptions);
      console.log('User location:', coords);
      fetchWeather(coords.latitude, coords.longitude);
    };

    getLocation();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!weatherData) {
    return <Text>No weather data available.</Text>;
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={{ backgroundColor: '#000', marginBottom: 15 }}>
          <Text style={{ fontSize: 34, color: '#fff', fontWeight: 'bold', textAlign: 'center', }}>Keep It Moving</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', }}>{formattedDate}</Text>
        </View>
        <ScrollView style={{paddingHorizontal:16}}>
          <WeatherInfo
            location={weatherData.location}
            currentTempFahrenheit={weatherData.currentTempFahrenheit}
            minTempFahrenheit={weatherData.minTempFahrenheit}
            maxTempFahrenheit={weatherData.maxTempFahrenheit}
            chanceOfRain={weatherData.chanceOfRain}
            weatherDescription={weatherData.weatherDescription}
            weatherIcon={weatherData.weatherIcon}
          />

          <NewsComponent />

          <RecipeSearch />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ?
      StatusBar.currentHeight : 0,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Home;
