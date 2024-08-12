// WeatherInfo.js
import React from 'react';
import { View, Text, StyleSheet, Image ,Platform} from 'react-native';

const WeatherInfo = ({ location, currentTempFahrenheit, minTempFahrenheit, maxTempFahrenheit, chanceOfRain, weatherDescription, weatherIcon }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weather in {location}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', }}>
                <View style={{alignItems:'center',}} >
                    <Text style={styles.currentTemp}>{Number(currentTempFahrenheit).toFixed(1)}°F</Text>
                    <Text style={styles.text}>Current Temperature</Text>
                </View>

                <View>
                    <Text style={styles.text}>Hi/{Number(maxTempFahrenheit).toFixed(1)}°F</Text>
                    <Text style={styles.text}>Lo/{Number(minTempFahrenheit).toFixed(1)}°F</Text>
                </View>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', }} >
                {weatherIcon && <Image source={{ uri: weatherIcon }} style={styles.icon} />}
                <View>
                    <Text style={styles.text}>{chanceOfRain}% Chance of Rain</Text>
                    <Text style={styles.text}>{weatherDescription}</Text>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius:25,
        backgroundColor:'#fff',
        paddingHorizontal:'auto',
        paddingVertical:10,
        shadowColor: Platform.OS === 'web' || 'ios' ? '#00000090' : null,
        shadowOffset: {
            height: Platform.OS === 'web' || 'ios' ? 2 : null,
            width: Platform.OS === 'web' || 'ios' ? 2 : null
        },
        shadowRadius: Platform.OS === 'web' || 'ios' ? 3 : null,
        elevation:3
    },
    title: {
        textAlign:'center',
        fontSize: 32,
        fontWeight: '800',
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        marginVertical: 5,
    },
    currentTemp: {
        fontSize:32,
        fontWeight: '900',
    },
    icon: {
        width: 64,
        height: 64,
        marginVertical: 10,
    },
})

export default WeatherInfo;
