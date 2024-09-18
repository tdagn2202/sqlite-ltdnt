import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite/legacy'
import { useEffect, useState, useCallback } from 'react';


export default function App() {
  const [data, setData] = useState('Empty')
  const [printData, setPrintData] = useState('')
  const db = SQLite.openDatabase('thanhNgan.db');
  const callback = useCallback();

  const [id, setId] = useState(0)
  const [name, setName] = useState('')
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
        (unprops, error) => console.log("Table này không tồn tại hoặc đã bị xóa")
      );
    });
  };

  const removeDataPrompt = () => {
    Alert.prompt(
      "Remove Data By ID",
      "Nhập id của dòng dữ liệu cần xóa", 
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: id => {
            if (id) {
              removeData(id); // Pass the ID to removeData
            }
          }
        }
      ],
      "plain-text" // This will make the input a plain text input
    );
  }
  

  const removeData = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM users3 WHERE id = ?',
        [id],
        (txObj, resultSet) => {
          console.log(`Deleted rows: ${resultSet.rowsAffected}`);
          getData(); // Refresh the data after deletion
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  const dropTable = () => {
    console.log("Remove button hit");
    db.transaction((tx) => {
      tx.executeSql(
        'DROP TABLE IF EXISTS users3',
        [],
        (txObj, resultSet) => {
          console.log(`Table dropped`);
          getData();
        },
        (txObj, error) => console.log('Error dropping table:', error.message)
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

  const updateData = (id, name) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE users3 SET name =? WHERE id =?',
        [name, id],
        (txObj, resultSet) => {
          console.log(`Updated rows: ${resultSet.rowsAffected}`);
          getData(); // Refresh the data after update
        },
        (txObj, error) => console.log(error)
      );
    });
  }

  const combinedFunction2 =(name) => {
    setName(name);
    updateData(id, name); // Pass the ID and name to updateData
  }

  const updateDataPrompt2 = (id) => {
    Alert.prompt(
      "Update Data",
      "Nhập id và tên mới của dòng dữ liệu",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress :(name) => combinedFunction2(name)
        },
      
      ],
      "plain-text" // This will make the input a plain text input
    );
  }

  const updateDataPrompt = () => {
    Alert.prompt(
      "Update Data",
      "Nhập id và tên mới của dòng dữ liệu",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: (id) => {
            setId(id);
            updateDataPrompt2(); // Call the second prompt after getting the id
          }
        },
      
      ],
      "plain-text" // This will make the input a plain text input
    );
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

      <Button
        title = "Remove Data"
        onPress = {removeDataPrompt}
      ></Button>

      <Button
        title = "Update data"
        onPress={updateDataPrompt}
      >
        
      </Button>

      <TouchableOpacity
        onPress = {dropTable}
        // onPress={() => Alert.alert("Hit")}
      >
        <View style = {{height:50, width: 150, backgroundColor: 'red', justifyContent: 'center', alignItems:'center',
          borderRadius: 100, top:100}}>

          <Text style ={{color: 'white', fontSize:17, fontWeight:'bold'}}>
            Remove table
          </Text>
        </View>
      </TouchableOpacity>

      {/* <Button
        title='Reload Data'
        onPress={getData}
      > */}
        
      {/* </Button> */}

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
