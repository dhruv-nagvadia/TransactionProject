import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
  TextInput,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import SQLite from 'react-native-sqlite-storage';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import {Image} from 'react-native';

const db = SQLite.openDatabase(
  {
    name: 'transaction.db',
    location: 'default',
  },
  () => console.log('Database opened'),
  error => console.log(error),
);

const AddExpenses = ({route, navigation}) => {
  const {userName} = route.params;
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([
    {label: 'Food', value: 'food'},
    {label: 'Travel', value: 'travel'},
    {label: 'Entertainment', value: 'entertainment'},
    {label: 'Shopping', value: 'shopping'},
    {label: 'Movie', value: 'movie'},
  ]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = () => {
    if (!amount) {
      Alert.alert('Error', 'Amount is required');
      return;
    }
    if (!title) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Category is required');
      return;
    }
    if (!date) {
      Alert.alert('Error', 'Date is required');
      return;
    }
    const formattedDate = date.toISOString().split('T')[0];
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO transactions (name, amount, title, note, category, date) VALUES (?, ?, ?, ?, ?, ?)',
        [userName, amount, title, note, category, formattedDate],
        () => {
          Alert.alert('Success', 'Transaction added successfully');
          navigation.goBack();
        },
        error => console.log('Error inserting data:', error),
      );
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828778.png',
          }}
          style={styles.closeImage}
        />
      </TouchableOpacity>

      <View style={styles.centeredContainer}>
        <Text style={styles.title}>Add Expenses</Text>

        <View style={styles.box1}>
          <Text style={styles.box2}>$</Text>

          <MaskedView
            maskElement={
              <TextInput
                placeholder="0"
                placeholderTextColor="rgba(0,0,0,1)"
                style={[styles.box5, {color: '#000'}]}
                value={amount}
                onChangeText={setAmount}
              />
            }>
            <LinearGradient
              colors={['#1cd8f9', '#b85dff', '#ffa470']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <TextInput
                placeholder="0"
                placeholderTextColor="transparent"
                style={[styles.box5, {opacity: 0}]}
                value={amount}
                onChangeText={setAmount}
              />
            </LinearGradient>
          </MaskedView>
        </View>

        <View style={styles.box4}>
          <MaskedView
            maskElement={
              <TextInput
                placeholder="ENTER TITLE"
                placeholderTextColor="rgba(0,0,0,1)"
                style={[styles.box3, {color: '#000', opacity: 1}]}
                value={title}
                onChangeText={setTitle}
              />
            }>
            <LinearGradient
              colors={['#1cd8f9', '#b85dff', '#ffa470']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <TextInput
                placeholder="ENTER TITLE"
                placeholderTextColor="transparent"
                style={[styles.box3, {opacity: 0}]}
                value={title}
                onChangeText={setTitle}
              />
            </LinearGradient>
          </MaskedView>
        </View>

        <View style={styles.box4}>
          <MaskedView
            maskElement={
              <TextInput
                placeholder="ENTER NOTE"
                placeholderTextColor="rgba(0,0,0,1)"
                style={[styles.box3, {color: '#000', opacity: 1}]}
                value={note}
                onChangeText={setNote}
              />
            }>
            <LinearGradient
              colors={['#1cd8f9', '#b85dff', '#ffa470']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <TextInput
                placeholder="ENTER NOTE"
                placeholderTextColor="transparent"
                style={[styles.box3, {opacity: 0}]}
                value={note}
                onChangeText={setNote}
              />
            </LinearGradient>
          </MaskedView>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDatePicker(true)}>
          <MaskedView
            maskElement={
              <Text style={[styles.date, {color: '#000', opacity: 1}]}>
                DATE
              </Text>
            }>
            <LinearGradient
              colors={['#1cd8f9', '#b85dff', '#ffa470']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <Text style={[styles.date, {opacity: 0}]}>DATE</Text>
            </LinearGradient>
          </MaskedView>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <View style={styles.gradientDropdown}>
          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={open}
              value={category}
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              placeholder="CATEGORY"
              placeholderStyle={{color: '#b85dff'}}
              style={[styles.dropdown, {backgroundColor: '#ffffff'}]}
              textStyle={styles.droptext}
              selectedItemLabelStyle={styles.stext}
              dropDownContainerStyle={{
                width: '80%',
                alignSelf: 'center',
                position: 'absolute',
                top: '50%',
                left: '10%',
              }}
              modalProps={{
                animationType: 'fade',
                transparent: true,
              }}
              arrowIconStyle={{tintColor: '#b85dff'}}
            />
          </View>
        </View>
      </View>

      <LinearGradient
        start={{x: 0.0, y: 0.2}}
        end={{x: 0.9, y: 1}}
        locations={[0.1, 0.4, 1]}
        colors={['#1cd8f9', '#b85dff', '#ffa470']}
        style={styles.gradientOverlay}>
        <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  droptext: {
    fontSize: 18,
    color: '#586363',
  },
  stext: {
    color: '#b85dff',
  },
  title: {
    fontSize: 25,
    fontWeight: '500',
    color: '#586363',
  },
  box1: {
    height: 90,
    width: '60%',
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box2: {
    fontWeight: '500',
    fontSize: 25,
    color: '#646363',
  },
  box3: {
    fontSize: 18,
    marginStart: 10,
    marginTop: 7,
  },
  box4: {
    height: 60,
    width: '80%',
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
  box5: {
    fontWeight: '400',
    fontSize: 54,
    color: '#fe73e7',
  },
  dropdown: {
    height: 60,
    borderWidth: 0,
    borderRadius: 15,
    width: '80%',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 60,
    width: '80%',
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
  },
  date: {
    fontSize: 20,
    elevation: 15,
    color: '#586363',
    marginStart: 10,
  },
  buttonText: {
    fontSize: 25,
    color: '#ffffff',
  },
  submit: {},
  gradientOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    width: '80%',
    marginTop: 'auto',
    elevation: 15,
    marginBottom: 25,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 30,
    zIndex: 10,
  },
  closeImage: {
    width: 24,
    height: 24,
    tintColor: '#586363',
  },
  gradientDropdown: {
    width: '80%',
    borderRadius: 15,
    padding: 2,
    marginTop: 20,
  },
  dropdownContainer: {
    borderRadius: 15,
  },
  dropdown: {
    height: 60,
    borderWidth: 0,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
  },
});

export default AddExpenses;
