import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Keyboard, Image, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecipeSearch = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardOffset(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardOffset(0)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSearch = async () => {
    const ingredients = searchText.split(',').map(ingredient => ingredient.trim());
    let allRecipes = [];

    try {
      for (const ingredient of ingredients) {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();
        if (data.meals) {
          allRecipes = [...allRecipes, ...data.meals];
        }
      }
      // Remove duplicates based on meal ID
      const uniqueRecipes = Array.from(new Set(allRecipes.map(recipe => recipe.idMeal)))
        .map(id => allRecipes.find(recipe => recipe.idMeal === id));

      setRecipes(uniqueRecipes);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSubmitEditing = () => {
    handleSearch();
    Keyboard.dismiss(); // Close the keyboard after searching
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => Linking.openURL(item.strSource)} style={styles.recipeItem}>
      <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={{textAlign:'center', fontSize:30,fontWeight:'bold',}} >Search New Recipes</Text>
      <Text style={{textAlign:'center', fontSize:18,}} >Find recipes by ingredient</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search-circle" size={24} color="black" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder='"chicken", "tomato", "garlic"'
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSubmitEditing} // Trigger search when "Done" is pressed
          returnKeyType="done" // Show "Done" key on the keyboard
        />
      </View>
      <Button title="Search Recipes" onPress={handleSearch} />

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={[styles.modalContent, { marginBottom: keyboardOffset }]}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          <FlatList
            data={recipes}
            renderItem={renderItem}
            keyExtractor={(item) => item.idMeal}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderRadius: 25,
    shadowColor: Platform.OS === 'web' || Platform.OS === 'ios' ? '#00000090' : null,
    shadowOffset: {
      height: Platform.OS === 'web' || Platform.OS === 'ios' ? 2 : null,
      width: Platform.OS === 'web' || Platform.OS === 'ios' ? 2 : null,
    },
    shadowRadius: Platform.OS === 'web' || Platform.OS === 'ios' ? 3 : null,
    elevation: 3,
    backgroundColor: '#fff',
    marginVertical:5,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchBar: {
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 100,
    paddingHorizontal: 40, // Add padding to accommodate the icon
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -12 }], // Center the icon vertically
  },
  modalContent: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeText: {
    fontSize: 16,
    color: 'blue',
    fontWeight: 'bold',
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  recipeImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  recipeTitle: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default RecipeSearch;
