import React, { Component } from 'react';

import {StyleSheet, View, Image, Text } from "react-native";

import RecipeCards from '../Component/RecipeCards';
import InfiniteScroll from '../Component/InfiniteScroll';

import FirebaseManager from '../Manager/FirebaseManager';

export default class Favoris extends Component {
    constructor(props) {
        super(props);
  
        this.state = {
          loading: true, 
          recipe: [],
          hasMore: true,
          page: 1,
        }
    }

    async componentWillMount() {
      this.loadRecipe();
    }

    async loadRecipe() {
      var page = this.state.page;
      var response = await FirebaseManager.getRecipeByFavoris(page);
      this.setState({recipe: response, loading: false, page: (page+1)});
    }

    async LoadMoreHandler() {
      this.loadRecipe();
    }

    render() {
        const styles = StyleSheet.create({
          text: {
            color: '#e22565',
            textAlign: 'center',
            fontSize: 30,
            marginTop: 16,
            marginBottom: 8,
            fontWeight: "bold"
          },
          content:{
            justifyContent: 'center', 
            alignItems: 'center'
          }
        });

        if(this.state.loading) {
          return(
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={require("../../assets/spinner.gif")} />
            </View>
          );
        }
        
        var recets;

        if(this.state.recipe.length > 0) {
          recets = this.state.recipe.map((recette, i) => {
            return(<RecipeCards key={i} favoris={false} recipe={recette} />);
         });
        } else {
          recets = <Text style={{ fontSize: 22, textAlign: 'center', marginTop: 10 }}>Aucune recette dans la liste des favoris !</Text>;
        }

          return(
            <View>
              <InfiniteScroll style={{height: 520}} loadBefore="30" onLoadMore={this.LoadMoreHandler.bind(this)}>
                  {recets}
              </InfiniteScroll>
            </View>
          )

      }
}