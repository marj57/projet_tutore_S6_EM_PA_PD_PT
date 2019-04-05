import React, { Component } from 'react';

import {StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { Link } from "react-router-native";


import RecipeCards from '../Component/RecipeCards';
import InfiniteScroll from '../Component/InfiniteScroll';
import FirebaseManager from '../Manager/FirebaseManager';

export default class Tag extends Component {
    constructor(props) {
        super(props);
    
        var istag = false;
        var tag = undefined;

        if(this.props.match != undefined) {
          if(this.props.match.params.tag != undefined) {
            istag = true;
            tag = this.props.match.params.tag;
          }
        }

        this.state = {
          loading: true, 
          tags: [],
          istag: istag,
          tagName: tag,
          hasMore: true,
          page: 1,
        }
    }

    async componentWillMount() {
      if(!this.state.istag) {
        var tags = await FirebaseManager.getTagList();
        this.setState({tags: tags, loading: false});
      } else {
        this.loadRecipe();
      }
    }

    async loadRecipe() {
      var page = this.state.page;
      var tags = await FirebaseManager.getRecipeByTag(this.state.tagName, page);
      this.setState({tags: tags, loading: false, page: (page+1)});
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
          },
          tags: {
            backgroundColor: '#fbf3c2',
            padding: 3,
            marginTop: 5,
            marginBottom: 5,
            color: '#fff',
            borderRadius: 5,
          }
        });

        if(this.state.loading) {
          return(
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={require("../../assets/spinner.gif")} />
            </View>
          );
        }
        
        if(!this.state.istag) {
          const AffTag = this.state.tags.map((tag, i) => {
              return (
                <View key={i} style={styles.tags}>
                  <Link to={"tag/"+tag}><Text style={{marginBottom: 4, fontSize: 25}}>#{tag}</Text></Link>
                </View>
                
              );
          });

          return (
            <ScrollView style={{height: 500}}>
              <View style={styles.content}>
                <Text style={styles.text}>Liste des tags disponibles :</Text>
                  {AffTag}
              </View>
            </ScrollView>
          );
        } else {
          const recets = this.state.tags.map((recette, i) => {
            return(<RecipeCards key={i} recipe={recette} />);
         });

          return(
            <View>
              <InfiniteScroll style={{height: 520}} loadBefore="30" onLoadMore={this.LoadMoreHandler.bind(this)}>
                  {recets}
              </InfiniteScroll>
            </View>
          )
        } 

      }
}