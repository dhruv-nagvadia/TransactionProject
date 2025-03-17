import React, {useEffect, useState, useCallback} from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SQLite from 'react-native-sqlite-storage';
import {useFocusEffect} from '@react-navigation/native';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';

const db = SQLite.openDatabase(
  {
    name: 'transaction.db',
    location: 'default',
  },
  () => console.log('Database opened'),
  error => console.log(error),
);

const Home = ({route, navigation}) => {
  const {userName} = route.params;
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    createTable();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
      getTotalAmountPerUser(userName);
    }, [userName, transactions]),
  );

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount INTEGER, title TEXT, note TEXT, category TEXT, date TEXT);',
        [],
        () => console.log('Table created successfully'),
        error => console.log('Error creating table:', error),
        S,
      );
    });
  };

  const getData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM transactions WHERE name=?',
        [userName],
        (tx, results) => {
          const rows = results.rows.raw();
          setTransactions(rows);
          console.log('Fetched Transactions:', rows);
        },
        error => console.log('Error fetching data:', error),
      );
    });
  };

  const getTotalAmountPerUser = (userName, callback) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT SUM(amount) as totalAmount FROM transactions WHERE name=?',
        [userName],
        (tx, results) => {
          const totalAmount = results.rows.item(0).totalAmount || 0;
          setTotalAmount(totalAmount);
          console.log('Total Amount for', userName, ':', totalAmount);
        },
        error => {
          console.log('Error fetching total amount:', error);
          callback(0);
        },
      );
    });
  };

  const deleteTransaction = id => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM transactions WHERE id=?',
        [id],
        () => {
          console.log('Transaction deleted');

          setTransactions(prevTransactions =>
            prevTransactions.filter(item => item.id !== id),
          );

          getTotalAmountPerUser(userName);
        },
        error => console.log('Error deleting transaction:', error),
      );
    });
  };

  const renderRightActions = id => {
    return (
      <LinearGradient
        start={{x: 0.3, y: 0.0}}
        end={{x: 0.5, y: 1.0}}
        locations={[0.1, 0.4, 1]}
        colors={['#ffa470', '#b85dff', '#1cd8f9']}
        style={styles.deleteButton}>
        <TouchableOpacity onPress={() => deleteTransaction(id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <LinearGradient
            start={{x: 0.3, y: 0.0}}
            end={{x: 0.5, y: 1.0}}
            locations={[0.1, 0.4, 1]}
            colors={['#1cd8f9', '#b85dff', '#ffa470']}
            style={styles.gradientOverlay}>
            <Text style={styles.header}>Total Expense</Text>
            <Text style={styles.title}>$ {totalAmount}.00</Text>
          </LinearGradient>

          <View style={styles.chart}>
            <Text style={styles.header1}>1 Jan 2025- 31 Dec 2025</Text>

            <View style={styles.graphWrapper}>
              <View style={styles.yAxisContainer}>
                {(() => {
                  const monthlyData = Array(12).fill(0);
                  transactions.forEach(item => {
                    const monthIndex = new Date(item.date).getMonth();
                    monthlyData[monthIndex] += item.amount;
                  });

                  const maxExpense = Math.max(...monthlyData, 1);
                  const stepSize = Math.ceil(maxExpense / 5);
                  const yAxisValues = Array.from(
                    {length: 6},
                    (_, i) => stepSize * i,
                  ).reverse();

                  return yAxisValues.map(value => (
                    <Text key={value} style={styles.yAxisLabel}>
                      ${value}
                    </Text>
                  ));
                })()}
              </View>

              <View style={styles.graphContainer}>
                {(() => {
                  const monthlyData = Array(12).fill(0);
                  transactions.forEach(item => {
                    const monthIndex = new Date(item.date).getMonth();
                    monthlyData[monthIndex] += item.amount;
                  });

                  const maxExpense = Math.max(...monthlyData, 1);

                  return monthlyData.map((amount, index) => (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.barBackground}>
                        <LinearGradient
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 1}}
                          locations={[0.1, 0.6, 1]}
                          colors={['#1cd8f9', '#b85dff', '#ffa470']}
                          style={[
                            styles.barFill,
                            {height: `${(amount / maxExpense) * 100}%`},
                          ]}
                        />
                      </View>
                      <Text style={styles.monthLabel}>
                        {
                          [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr', 
                            'May',
                            'Jun',
                            'Jul',
                            'Aug',
                            'Sep',
                            'Oct',
                            'Nov',
                            'Dec',
                          ][index]
                        }
                      </Text>
                    </View>
                  ));
                })()}
              </View>
            </View>
          </View>

          <View style={styles.Transaction1}>
            <Text style={styles.Transaction2}>Transactions</Text>
          </View>

            {transactions.slice().reverse().map((item, index) => (
              <Swipeable
                key={item.id} 
                renderRightActions={() => renderRightActions(item.id)}>
                <View style={styles.card}>
                  <Image
                    source={{
                      uri:
                        item.category === 'food'
                          ? 'https://cdn-icons-png.flaticon.com/128/17235/17235268.png'
                          : item.category === 'travel'
                          ? 'https://cdn-icons-png.flaticon.com/128/1053/1053457.png'
                          : item.category === 'entertainment'
                          ? 'https://cdn-icons-png.flaticon.com/128/16758/16758105.png'
                          : item.category === 'shopping'
                          ? 'https://cdn-icons-png.flaticon.com/128/5542/5542671.png'
                          : 'https://cdn-icons-png.flaticon.com/128/6811/6811624.png',
                    }}
                    style={styles.image}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.category}>{item.category}</Text>
                    <Text style={styles.title1}>{item.title}</Text>
                  </View>

                  <Text style={styles.amount}>${item.amount}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </Swipeable>
            ))}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  scroll: {
    height: 'auto',
    width: '90%',
    marginBottom: 80,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    margin: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 90,
  },
  image: {
    height: 45,
    width: 45,
    marginRight: 10,
  },
  chart: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '100%',
    marginTop: 20,
    borderRadius: 20,
    height: 300,
    padding: 15,
  },
  category: {
    fontSize: 21,
    color: '#474747',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title1: {
    fontSize: 15,
    color: '#586363',
  },
  amount: {
    position: 'absolute',
    right: 20,
    top: 18,
    fontSize: 18,
    color: '#586363',
    fontWeight: 'bold',
  },
  date: {
    position: 'absolute',
    right: 20,
    bottom: 18,
    fontSize: 15,
    color: '#6c7c7c',
  },
  header: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '400',
    color: '#ffffff',
  },
  header1: {
    fontSize: 18,
    fontWeight: '500',
    color: '#3a6e6e',
    marginTop: 10,
  },
  gradientOverlay: {
    marginTop: 25,
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  graph: {
    marginTop: 25,
    height: 300,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  Transaction1: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  Transaction2: {
    fontSize: 20,
    margin: 10,
    fontWeight: 'bold',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    height: 89,
    marginTop: 10,
    width: 55,
  },
  deleteText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#ffffff',
  },
  graphWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    height: 250,
    paddingHorizontal: 10,
  },
  yAxisContainer: {
    justifyContent: 'space-between',
    height: 200,
    marginRight: 10,
    marginBottom: 22.5,
  },
  yAxisLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3a6e6e',
    textAlign: 'right',
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
  },
  barContainer: {
    alignItems: 'center',
    width: '8%',
  },
  barBackground: {
    width: 10,
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#1cd8f9',
    borderRadius: 10,
  },
  monthLabel: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3a6e6e',
  },
});

export default Home;
