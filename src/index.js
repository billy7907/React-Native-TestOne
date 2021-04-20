import React, { Component } from "react";
import { ActivityIndicator, FlatList, View, Text, StyleSheet} from "react-native";
import { ListItem, Avatar } from "react-native-elements";

export default class FileList extends Component {
  state = {
    data: [],
    page: 1,
    loading: false
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true });

    try{
      const response = await fetch("https://api.github.com/gists/public?per_page=15&page=1");
      const json = await response.json();
      this.setState(state => ({
        data: [...state.data, ...json],
        loading: false
      }));
    }catch(e){
      console.log(e)
    }
  };

  handleEnd = () => {
    this.setState(state => ({ page: state.page + 1 }), () => this.fetchData());
  }

  render() {
    return (
      <View>
      <Text style={styles.title}>Gists</Text>
        <FlatList 
          data={this.state.data}
          keyExtractor={(x, i) => i}
          onEndReached={() => this.handleEnd()}
          onEndReachedThreshold={10}
          ListFooterComponent={() => {
            return this.state.loading ? null : <ActivityIndicator size='large' animating />
          }}
          renderItem={({ item, index }) =>
            <ListItem key={index} bottomDivider>
              <Avatar source={{uri: item?.owner?.avatar_url}} size='medium' />
              <ListItem.Content>
                <ListItem.Title>{Object.keys(item.files)[0]}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    marginLeft: 15,
    height: 20
  }
})