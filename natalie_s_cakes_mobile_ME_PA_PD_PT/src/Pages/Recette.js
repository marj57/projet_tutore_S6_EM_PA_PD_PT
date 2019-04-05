import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import {Collapse,CollapseHeader, CollapseBody} from 'accordion-collapse-react-native';

import { Icon } from 'react-native-elements';

import FirebaseManager from '../Manager/FirebaseManager';
import LocalStorageManager from '../Manager/LocalStorageManager';


const styles = StyleSheet.create({
  collapse: {
    borderWidth: 0.5,
    borderColor: '#e22565',
    padding: 5,
    backgroundColor: '#F0EDEC'
  },
  ScrollView: {
    flexGrow: 1
  },
  container: {
    flex: 1,
   },
   item: {
     padding: 5,
     fontSize: 18,
   },
});


export default class Recette extends Component {
  constructor(){
    super();
    this.state = {
      recette: null,
      loading: true 
    }
  }
  onContentSizeChange= (contentWidth, contentHeight) => {
    this.setState({screenHeight: contentHeight});
  }

  async componentWillMount() {
    var response = await FirebaseManager.getOnceRecipe(this.props.match.params.id);
    this.setState({recette: response, loading: false});
  }

  async FavorisclickHandler() {
    this.setState({
      recette: await FirebaseManager.toggleFavoris(this.state.recette),
    })
  }

  async addIngredientToCart() {
    LocalStorageManager.AddList(this.state.recette.ingredient);
  }

  render() {
    if(this.state.loading) {
      return(
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require("../../assets/spinner.gif")} />
        </View>
      );
    }
    var recette = this.state.recette;

    var name = "heart-o";
    if(recette.favoris) {
      name = "heart";
    }

    const affIngredient = recette.ingredient.map((value) => {
      var affUnit = value['unit'];

      if(affUnit == "soupe") {
        affUnit = "Cuillère à soupe";
      } else if(affUnit == "cafe") {
        affUnit = "Cuillère à café";
      }

      return(
        <View key={value['label']} style={styles.item}>
          <Text>{value['label']} : {value['quantite']+" "+affUnit}</Text>
        </View>
      )
    })

    return (
      <ScrollView style={{height: 475}}>
          <Image style = {{resizeMode: 'contain', height: 200, marginTop: 10}} source={{uri: recette.image}} />
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{fontSize: 25, color: '#e22565', textAlign: 'center'}}>{recette.nom}</Text>
            <Icon raised name={name} type='font-awesome' color='#f50' onPress={this.FavorisclickHandler.bind(this)} />
            <Icon reverse name="shopping-cart" type='font-awesome' color='#e22565' onPress={this.addIngredientToCart.bind(this)} />
          </View>

          <View style={{flexDirection:'row',marginLeft: 'auto', marginRight: 'auto'}}>
            <View>
              <Image source={require("../../assets/gateau_parts.png")} style={{resizeMode: 'stretch', width: 75, height: 75}}/>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'stretch'}}>
              <Text style={{fontSize: 22}}>{recette.nbr_pers}</Text>
            </View>
            <View style={{paddingLeft: 5}}>
              <Image source={require("../../assets/materiel.png")} style={{resizeMode: 'stretch', width: 75, height: 75}}/>
            </View>
            <View style={{paddingRight: 5, justifyContent: 'center', alignItems: 'stretch'}}>
              <Text style={{fontSize: 22}}>{recette.temps_preparation}</Text>
            </View>
            <View>
              <Image source={require("../../assets/four.png")} style={{resizeMode: 'stretch', width: 60, height: 60}}/>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'stretch'}}> 
              <Text style={{fontSize: 22}}>{recette.temps_cuisson}</Text>
            </View>
          </View>

          <Collapse>
          <CollapseHeader style={styles.collapse}>
              <View>
                <Text style={{fontSize: 18, textAlign: 'center'}}>Ingrédient(s) et matériel(s)</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View style={styles.container}>
                {affIngredient}
              </View>
            </CollapseBody>
          </Collapse>

          <Collapse>
            <CollapseHeader style={styles.collapse}>
              <View>
                <Text style={{fontSize: 18, textAlign: 'center'}}>Préparation</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <Text>{recette.preparation}</Text>
            </CollapseBody>
          </Collapse>
          
          <Collapse>
            <CollapseHeader style={styles.collapse}>
              <View>
                <Text style={{fontSize: 18, textAlign: 'center'}}>Astuce(s) et commentaire(s)</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <Text>{recette.astuces}</Text>
            </CollapseBody>
          </Collapse>
      </ScrollView>
    );
  }
}


