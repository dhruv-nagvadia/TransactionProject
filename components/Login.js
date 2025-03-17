import React, {useEffect, useState} from 'react';
import {
  Alert,
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import LinearGradient from 'react-native-linear-gradient';
// import Video from 'react-native-video';

const db = SQLite.openDatabase(
  {
    name: 'test.db',
    location: 'default',
  },
  () => console.log('Database opened'),
  error => console.log(error),
);

const Login = ({navigation}) => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    createTable();
    getData();
  }, []);

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);',
        [],
        () => console.log('Table created successfully'),
        error => console.log('Error creating table:', error),
      );
    });
  };

  const insertData = ({navigation}) => {
    if (name.trim() === '') {
      Alert.alert('Please enter a name');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Users WHERE name = ?',
        [name],
        (tx, results) => {
          if (results.rows.length > 0) {
            navigation.navigate('Home', {userName: name});
          } else {
            tx.executeSql(
              'INSERT INTO Users (name) VALUES (?)',
              [name],
              () => {
                setName('');
                getData();
                navigation.navigate('Home', {userName: name});
              },
              error => console.log('Error inserting data:', error),
            );
          }
        },
        error => console.log('Error checking data:', error),
      );
    });
  };

  const getData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Users',
        [],
        (tx, results) => {
          let rows = [];
          for (let i = 0; i < results.rows.length; i++) {
            rows.push(results.rows.item(i));
          }
          setData(rows);
        },
        error => console.warn('Error fetching data:', error),
      );
    });
  };

  const clearData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Users',
        [],
        () => {
          tx.executeSql(
            'DELETE FROM sqlite_sequence WHERE name="Users";',
            [],
            () => console.log('Primary key reset to 1'),
            error => console.log('Error resetting primary key:', error),
          );
          getData();
        },
        error => console.log('Error clearing data:', error),
      );
    });
  };

  // const onBuffer = data => {
  //   console.log('on buffering==>>>', data);
  // };
  // const videoError = data => {
  //   console.log('error raised===>>>>', data);
  // };

  return (
    <View style={styles.container}>
    {/* <Video
      source={require('../res/videoFile/travel.mp4')}
      onBuffer={onBuffer}
      onError={videoError}
      resizeMode="cover"
      repeat
      muted
      style={styles.backgroundVideo}
    /> */}

    <View style={styles.overlay}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#ffffff"
        />
      </View>

      <LinearGradient
        start={{x: 0.0, y: 0.2}}
        end={{x: 0.9, y: 1}}
        locations={[0.1, 0.4, 1]}
        colors={['rgba(28, 216, 249, 1)', 'rgba(184, 93, 255, 1)', 'rgba(255, 164, 112, 1)']}
        style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => insertData({navigation})}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* <LinearGradient
        start={{x: 0.0, y: 0.2}}
        end={{x: 0.9, y: 1}}
        locations={[0.1, 0.4, 1]}
        colors={['rgba(28, 216, 249, 0.7)', 'rgba(184, 93, 255, 0.7)', 'rgba(255, 164, 112, 0.7)']}
        style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={getData}>
          <Text style={styles.buttonText}>Check Data</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient
        start={{x: 0.0, y: 0.2}}
        end={{x: 0.9, y: 1}}
        locations={[0.1, 0.4, 1]}
        colors={['rgba(28, 216, 249, 0.7)', 'rgba(184, 93, 255, 0.7)', 'rgba(255, 164, 112, 0.7)']}
        style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={clearData}>
          <Text style={styles.buttonText}>Clear Data</Text>
        </TouchableOpacity>
      </LinearGradient> */}
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#f4f4f4"
  },
  input: {
    borderWidth: 1,
    borderColor: '#3e3e3e',
    borderRadius: 5,
    width: '100%',
    height: 50,
    textAlign: 'center',
    fontSize: 23,
    color: '#3e3e3e',
  },
  buttonContainer: {
    borderRadius: 8,
    marginVertical: 10,
    width: '70%',
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 350,
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4', 
    width: '100%',
  },
});

export default Login;
