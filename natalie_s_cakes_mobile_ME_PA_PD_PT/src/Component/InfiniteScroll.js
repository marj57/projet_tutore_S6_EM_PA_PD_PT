import React, { Component } from 'react';

import { ScrollView } from "react-native";

export default class InfiniteScroll extends Component {
  loadBefore = 0;
  constructor(props) {
    super(props);

    if(this.props.onLoadMore == undefined) {
      console.error("Le Composant Infinite Scroll a besoin d'un attribut OnLoadMore !");
    }

    if(this.props.loadBefore != undefined || this.props.loadBefore >= 0) {
      this.loadBefore = this.props.loadBefore;
    }
  }

  ScrollHandler(e) {
    const nativeEvent = e.nativeEvent;
    const layoutMeasurement = nativeEvent.layoutMeasurement;
    const contentOffset = nativeEvent.contentOffset;
    const contentSize = nativeEvent.contentSize;

    if(layoutMeasurement.height + contentOffset.y >= contentSize.height - this.loadBefore) {
      this.props.onLoadMore();
    }
  }

  render() {
    return (
      <ScrollView style={this.props.style} onScroll={this.ScrollHandler.bind(this)}>
        {this.props.children}
      </ScrollView>
    );
  }
}


