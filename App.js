import React from 'react';
import {
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from './components/Login';
import Home from './components/Home';
import AddExpense from './components/AddExpenses';
import LinearGradient from 'react-native-linear-gradient';
import 'react-native-reanimated';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomHeader = ({userName}) => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={{
        uri: 'https://img.freepik.com/free-vector/background-luxury-minimalist-gradient-style-design_698780-711.jpg',
      }}
      style={styles.headerContainer}
      resizeMode="cover">
      <Image
        style={styles.image}
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/128/3665/3665927.png',
        }}
        resizeMode="cover"
      />

      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>Welcome!</Text>
        <Text style={styles.headerName}>{userName}</Text>
      </View>

      <View style={{flex: 1, alignItems: 'flex-end', marginTop: 20}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.logout}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/4400/4400629.png',
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const TabNavigator = ({route}) => {
  const {userName} = route?.params;
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          position: 'absolute',
          paddingBottom: 90,
        },
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={Home}
        initialParams={{userName}}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <LinearGradient
              start={{x: 0.0, y: 0.2}}
              end={{x: 0.9, y: 1}}
              locations={[0.1, 0.4, 1]}
              colors={['#ffa470', '#b85dff', '#1cd8f9']}
              style={styles.circleButtonContainer}>
              <TouchableOpacity
                style={styles.circleButton}
                onPress={() => navigation.navigate('AddExpense', {userName})}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </LinearGradient>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={({route}) => ({
            headerShown: true,
            header: () => <CustomHeader userName={route.params?.userName} />,
          })}
        />
        <Stack.Screen
          name="AddExpense"
          component={AddExpense}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 20,
  },
  circleButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 50,
    fontWeight: '300',
    color: '#ffffff',
    marginBottom:5
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    height: 100,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000000',
  },
  image: {
    height: 50,
    width: 50,
    marginTop: 10,
  },
  titleContainer: {
    marginLeft: 20,
    marginTop: 10,
    flex: 1,
  },
  headerName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerTitle: {
    fontSize: 15,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginBottom: 30,
  },
  addButtonimage: {
    height: 70,
    width: 70,
  },
  logout: {
    height: 35,
    width: 35,
    marginRight: 10,
  },
});
