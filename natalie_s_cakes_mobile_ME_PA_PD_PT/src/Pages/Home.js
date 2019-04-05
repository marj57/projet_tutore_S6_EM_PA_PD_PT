import React, { Component } from 'react';

import { SearchBar } from 'react-native-elements';
import { View, Image, ToastAndroid } from "react-native";

import RecipeCards from '../Component/RecipeCards';
import InfiniteScroll from '../Component/InfiniteScroll'
import FirebaseManager from '../Manager/FirebaseManager';

export default class Home extends Component {
  constructor() {
    super();

    this.state = {
      loading: true, 
      hasMore: true,
      recettes: [],
      page: 1,
      maxPage: 1,
      search: "",
      findall: [],
    }

    this.setPageState();
  }

  async setPageState() {
    var response =  await FirebaseManager.getMaxPage();
    this.setState({   
       maxPage: response,
    });
  }

  async componentWillMount(){
    var response =  await FirebaseManager.getRecipe();
    this.setState({   
       findall: response,
    });

    this.loadNextRecipe();
  }

  async loadNextRecipe() {
    if(this.state.hasMore) {
      this.setState({   
        loading: true,
      });

      var page = this.state.page;
      var r = await FirebaseManager.getRecipePage(page);

      var more = true;
      if((page +1) > this.state.maxPage) {
         more = false;
      }

      this.setState({   
        hasMore: more,
        loading: false,
        page: (page+1), 
        recettes: r,
      });
    } else {
      ToastAndroid.show("Il n'y a plus de recette(s) à charger !", ToastAndroid.SHORT);
    }
  }

  async LoadMoreHandler() {
    this.loadNextRecipe();
  }

  search(value) {
    this.setState({
      search: value.toLowerCase(),
    })
  }

  render() {
    var recipe = this.state.recettes;

    if(this.state.search.trim() !== "") {
      recipe = this.state.findall.filter(recette => recette.nom.toLowerCase().includes(this.state.search));
    }

    const recets = recipe.map((recette) => {
       return(<RecipeCards key={recette.id} recipe={recette} />);
    });

    var load = <View />;
    if(this.state.loading) {
       if(this.state.hasMore) {
          load = <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{height: 250}} source={require("../../assets/spinner.gif")} />
                 </View>;
        }
    }

    return (
      <View>
        <SearchBar
        placeholder="Rechercher ..."
        platform="android"
        onChangeText={this.search.bind(this)}
        lightTheme
        value={this.state.search}
        />

        <InfiniteScroll style={{height: 470}} loadBefore="30" onLoadMore={this.LoadMoreHandler.bind(this)}>
            {recets}
            {load}
        </InfiniteScroll>
      </View>
    );
  }
}


