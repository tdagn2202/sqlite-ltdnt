import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SQLite from 'expo-sqlite/legacy'
import { useEffect, useState, callback, useCallback } from 'react';


export default function App() {
  const [data, setData] = useState('Empty')
  const [printData, setPrintData] = useState('')
  const db = SQLite.openDatabase('thanhNgan.db');
  const callback = useCallback();
  useEffect(()=>{
    db.transaction((tx)=> {
      tx.executeSql('CREATE TABLE IF NOT EXISTS users3 (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL);');
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
    
  }, [])

  const addData = (callback) => {
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO users3 (name) VALUES (?)',
        [data],
        (props, resultSet) => {
          console.log('Inserted ID: ', resultSet.insertId);
          if (callback) callback();
        },
        (unprops, error) => console.log(error.message)
      );
    });
  };

  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users3",
        null,
        (txtObj, result)=> {
            setPrintData(result.rows._array);            
        },
        (txtObj, error)=> {
          console.log(error);
        }
      )
    })
  }



  const combinedFunction = () => {
    // First add the data, then call getData as a callback
    addData(() => {
      getData(); // This ensures getData is called only after addData is completed
    });
  };

  useEffect(() => {
    if (printData.length > 0) {
      console.log('FROM GETDATA\n', printData);
    }
  }, [printData]);

  return (
    <View style={styles.container}>
      <Text className = "font-bold text-xl">Thanh Ngân</Text>
      <TextInput 
      onChangeText={(text)=>setData(text)}
      placeholder='Input here'/>
      
      <Button
        title = "Get Data"
        onPress={combinedFunction}
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
