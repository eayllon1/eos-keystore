import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import Button from './components/Button';
import Input from './components/Input';

const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });

export default class App extends React.Component {
  state = {
    privateKey: '',
    loggedIn: false,
  }

  onInputChange = (key, value) => {
    this.setState(prevState => ({
      ...prevState,
      [key]: value
    }))
  }

  retrieveItem = async (key) => {
    try {
      const retrievedItem =  await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return
  }

  storeItem = async (key, store) => {
    try {
      const privatekey = await AsyncStorage.setItem(key, JSON.stringify(store));
      return privatekey
    } catch (err) {
      console.log(err.message)
    }
  };

  removeItem = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch(exception) {
      return false;
    }
  }

  triggerStoreKey = async () => {
    await this.storeItem("PRIVATE_KEY", this.state.privateKey);
    this.setState({
      loggedIn: true
    })
  }

  triggerRemoveKey = async () => {
    let success = this.removeItem("PRIVATE_KEY");
    if (success) {
      this.setState({
        loggedIn: false,
        privateKey: ''
      })
    }
  }

  async componentDidMount() {
    try {
      let privkey = await this.retrieveItem("PRIVATE_KEY");
      console.log(privkey);
      if (privkey != '' && privkey != null) {
        this.setState({
          privateKey: privkey,
          loggedIn: true
        });
      }
    } catch (error) {
      console.log('Promise is rejected with error: ' + error);
    }
  }

  render() {
    console.log(this.state);
    return (
      <View style={styles.container}>
        <Text style = {{fontSize: 20, marginBottom: 20}}>
          EOS Keystore
        </Text>

        { this.state.loggedIn ? (
          <View>
            <Button
              title='Remove Privatekey'
              onPress={this.triggerRemoveKey}
             />
          </View>

        ) : (
          <View>
            <Input
              placeholder="Enter Private Key"
              type='privateKey'
              name='privateKey'
              onChangeText={this.onInputChange}
              value={this.state.privateKey}
            />
            <Button
              title='Load Account'
              onPress={this.triggerStoreKey}
             />
          </View>
        )}


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  image: {
    width: 100,
    height: 120,
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});
