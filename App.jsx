import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SQLite from 'expo-sqlite/legacy'
import { useEffect, useState, callback } from 'react';


export default function App() {
  const [data, setData] = useState('Empty')
  const [printData, setPrintData] = useState('')
  const db = SQLite.openDatabase('thanhNgan.db');
  useEffect(()=>{
    db.transaction((tx)=> {
      tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL);');
    })

    // db.transaction((tx) => {
    //   tx.executeSql(
    //     "SELECT * FROM users",
    //     null,
    //     (txtObj, result)=> {
    //         setData(result.rows._array);
    //         console.log("Data from table: " + data);
    //     },
    //     (txtObj, error)=> {
    //       console.log(error);
    //     }
    //   )
    // })

    getData()
    
  }, [])

  const addData = () => {
    console.log(data)
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO users (name) VALUES (?)',
        [data],
        (props, resultSet) => {
          console.log('Inserted ID: ', resultSet.insertId);
          
        },
        (unprops, error) => console.log(unprops.message)
      );
    })
  }

  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users",
        null,
        (txtObj, result)=> {
            setPrintData(result.rows._array);
            console.log("FROM GETDATA \n");
            console.log(printData)
            
        },
        (txtObj, error)=> {
          console.log(error);
        }
      )
    })
  }



  const combinedFuction = () => {
    addData();
  }

  return (
    <View style={styles.container}>
      <Text className = "font-bold text-xl">Thanh Ngân</Text>
      <TextInput 
      onChangeText={(text)=>setData(text)}
      placeholder='Input here'/>
      
      <Button
        title = "Get Data"
        onPress={combinedFuction}
      ></Button>

      <StatusBar style="auto" />  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
