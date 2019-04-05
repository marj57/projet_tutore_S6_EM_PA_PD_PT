import React, { Component } from 'react';

import { StyleSheet, Text, View, Image } from "react-native";
import { NativeRouter, Route, Link } from "react-router-native";
import { FontAwesome } from '@expo/vector-icons';

import Home from "./Pages/Home";
import Recette from "./Pages/Recette";
import Tag from "./Pages/Tag";
import Favoris from "./Pages/Favoris";
import Cart from "./Pages/Cart";


class Layout extends Component {
  render() {
    const styles = StyleSheet.create({
      header: {
        backgroundColor: '#fbf3c2',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 110
      },
      nav: {
        backgroundColor: '#e22565',
        flexDirection: "row",
        justifyContent: "space-around"
      },
      navItem: {
        flex: 1,
        alignItems: "center",
        padding: 10
      },
      subNavItem: {
        padding: 5
      },
    });


    return (
        <NativeRouter>
            <View>
              <View style={styles.header}>
                <Image 
                  style={{marginLeft: 'auto', marginRight: 'auto', resizeMode: 'stretch', width: 200, height: 100}} 
                  source={require("../assets/Logo.png")} 
                  alt="Logo du Site"/>
              </View>
              <View style={styles.nav}>
                <Link to="/" style={styles.navItem}>
                  <FontAwesome name="home" size={32} color="#a2a2a2" />
                </Link>
                <Link to="/tag" style={styles.navItem}>
                  <FontAwesome name="tags" size={32} color="#a2a2a2" />
                </Link>
                <Link to="/favoris" style={styles.navItem}>
                  <FontAwesome name="heart" size={32} color="#a2a2a2" />
                </Link>
                <Link to="/cart" style={styles.navItem}>
                  <FontAwesome name="shopping-cart" size={32} color="#a2a2a2" />
                </Link>
              </View>

              <Route exact path="/" component={Home} />
              <Route exact path="/tag" component={Tag} />
              <Route exact path="/tag/:tag" component={Tag} />
              <Route exact path="/favoris" component={Favoris} />
              <Route path="/cart" component={Cart} />
              <Route path="/recette/:id" component={Recette} />
            </View>
        </NativeRouter>
    );
  }
}

export default Layout;
