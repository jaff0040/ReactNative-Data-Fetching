import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Platform, StyleSheet, RefreshControl } from 'react-native';
import UserAvatar from 'react-native-user-avatar';
import { FAB } from 'react-native-paper'; 

const App = () => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch:
  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = async () => {
    try {                        //https://random-data-api.com/api/users/random_user?size=10
      const response = await fetch('https://random-data-api.com/api/v2/users?size=10');
      const data = await response.json();   
      console.log(data); 
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // fetch one user:
  const fetchMoreUser = async () => {
    try {                          //https://random-data-api.com/api/v2/users?size=1
      const response = await fetch('https://random-data-api.com/api/v2/users?size=1');
      const data = await response.json();
      setUsers(prevUsers => [data, ...prevUsers]); 
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  // Render FlatList:
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
                                      
      {Platform.OS === 'android' && <UserAvatar size={50} borderColor="black" borderWidth={2} name={item.first_name} src={item.avatar || 'fallback-avatar-url'} />}
      <View style={styles.nameContainer}>
        <Text style={styles.fName}>{item.first_name}</Text>
        <Text style={styles.lName}>{item.last_name}</Text>
      </View>
      {Platform.OS === 'ios' && <UserAvatar size={50} borderColor="black" borderWidth={2} name={item.first_name} src={item.avatar || 'fallback-avatar-url'} />}
      
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the User List</Text>

      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={fetchMoreUser}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF99B4',
    marginBottom: 10,
    marginTop: 35,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FDF5E6',
    borderColor: '#ddd',
  },
  nameContainer: {
    flex: 1,
    alignItems: Platform.OS === 'ios' ? 'flex-start' : 'flex-end',
    marginHorizontal: 10,
  },
  fName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  lName: {
    fontSize: 16,
    color: '#696969',
  },
  fab: {
    position: 'absolute',
    right: 40,
    bottom: 40,
    backgroundColor: '#FF99B4',
    borderRadius: 50,
    borderColor: 'black',  
    borderWidth: 2, 
  },
});

export default App;
