import React, { Component } from 'react';

import { Text, View, Image, Button } from "react-native";
import { Link } from "react-router-native";

import { Icon } from 'react-native-elements';
import FirebaseManager from '../Manager/FirebaseManager';

export default class RecipeCards extends Component {

  constructor(props) {
    super(props);
  
    if(this.props.recipe === undefined) {
      console.error("Aucune recette affiliée à la RecipeCards (props: recipe) !");
      return;
    } 

    var favoris = true;
    if(this.props.favoris !== undefined) {
      favoris = this.props.favoris;
    }

    var recette = this.props.recipe;

    this.state= {
      recette: recette,
      favoris: favoris,
    };
  }

  async clickHandler() {
    this.setState({
      recette: await FirebaseManager.toggleFavoris(this.state.recette),
    })
  }

  render() {
    const recette = this.state.recette;

    var name = "heart-o";
    if(recette.favoris) {
      name = "heart";
    }

    return (
        <Link to={"/recette/"+recette.id}>
                        <View style={{backgroundColor:'#fbf3c2', marginVertical: 5}}>
                          <Image
                              style={{height: 200}}
                             source={{uri: recette.image}}
                           />
                          <View style={{ 
                              flexDirection:'row', 
                              justifyContent: 'center', 
                              alignItems: 'center' }}
                            >
                            <Text style={{fontSize: 25, color: '#e22565', marginRight: 25}}>{recette.nom} </Text>
                            {this.state.favoris &&
                            <Icon raised name={name} type='font-awesome' color='#f50' onPress={this.clickHandler.bind(this)} />
                            }
                          </View>
                       </View>
                     </Link>
    );
  }
}


