import React, { Component } from 'react';

import { ScrollView, View, Image, Text, StyleSheet, Alert } from "react-native";
import { ListItem, Icon, Button } from "react-native-elements";
import LocalStorageManager from '../Manager/LocalStorageManager';

export default class Cart extends Component {
    constructor(){
        super();
        this.state = {
            list: [],
            loading: true 
        }
    }

    async componentDidMount(){
        this.load();
    }

    async load() {
        var value = await LocalStorageManager.getList();

        this.setState({
            list: value,
            loading: false,
        });
    }

    deleteAll() {
        var self = this;
        Alert.alert(
            'Suppression',
            'Etes-vous sûr de vouloir supprimer la totalité du panier ?',
            [
              {
                text: 'Non',
                style: 'cancel',
              },
              {
                  text: 'Oui', 
                  onPress: () => {
                      LocalStorageManager.clear();
                      self.load();
                    }
                },
            ],
            {cancelable: false},
          );
    }
    
    deleteItem(ingredient){
        var self = this;

        Alert.alert(
            'Suppression',
            'Etes-vous sûr de vouloir supprimer '+ingredient.label+" : "+ingredient.quantite +" "+ ingredient.unit+" ?",
            [
              {
                text: 'Non',
                style: 'cancel',
              },
              {
                  text: 'Oui', 
                  onPress: () => {
                      LocalStorageManager.Remove(ingredient);
                      self.load();
                    }
                },
            ],
            {cancelable: false},
          );
        
    }

    render() {
        if(this.state.loading) {
            return(
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require("../../assets/spinner.gif")} />
              </View>
            );
        }

        styles = StyleSheet.create({
            subtitle: {
                flexDirection : "row",
            },
        })

        var cartItems;
        console.log(this.state.list);
        if(this.state.list.length > 0) {
            cartItems = this.state.list.map((item, i) => {
                return (<ListItem 
                            key={i}
                                title = {item.label}
                                rightIcon = {
                                    <Icon raised color='red' name = "delete" onPress={this.deleteItem.bind(this, item)} />
                                }
                                subtitle = {
                                    <View style ={styles.subtitle}>
                                        <Text>{item.quantite} </Text>
                                        <Text> {item.unit}</Text>
                                    </View>
                                }       
                        />
                        )
                });
        } else {
            cartItems = <Text style={{ fontSize: 22, textAlign: 'center', marginTop: 10, marginBottom: 10 }}>Aucun ingrédient dans le panier !</Text>
        }


        return (
            <ScrollView style={{height: 475}}>
                {cartItems}
                <Button 
                raised
                icon={
                    <Icon
                    name="delete"
                    color="red"
                    style={{ marginLeft: 10 }}
                    />
                }
                type="outline"
                iconRight
                title="Supprimer tout"
                titleStyle={{ color:'red' }}
                buttonStyle={{ borderColor:'red', borderWidth: 1 }}
                onPress={this.deleteAll.bind(this)}
                />
            </ScrollView>
        );
    }
}