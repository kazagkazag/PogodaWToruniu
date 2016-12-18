/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import events from "events";
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions
} from 'react-native';
import {getWeatherForWeek, getActualTemp} from "./utils/parser";
import SvgUri from 'react-native-svg-uri';
import testData from "./data";

export default class PogodaWToruniu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      daysWeather: [],
      actualTemp: "",
      isLoading: true
    };

    this.updateLayoutProperties = this.updateLayoutProperties.bind(this);
  }

  componentDidMount() {
    console.log("Fetching data...");

    // fetch("http://pogodawtoruniu.pl/")
    // .then(response => response.text())
    // .then(response => {
    //   console.log("Fetched!");
    //   this.setState({
    //     daysWeather: getWeatherForWeek(response),
    //     actualTemp: getActualTemp(response),
    //     isLoading: false
    //   });
    // })
    // .catch(e => console.log(e));

    this.setState({
      daysWeather: getWeatherForWeek(testData),
      actualTemp: getActualTemp(testData),
      isLoading: false,
      layoutHeight: 0,
      layoutWidth: 0
    });
  }

  updateLayoutProperties(event) {
    const layout = event.nativeEvent.layout;

    this.setState({
      layoutWidth: layout.width,
      layoutHeight: layout.height
    });
  }

  renderLoader() {
    return this.state.isLoading ? (
      <Text>
        Loading
      </Text>
    ) : null;
  }

  renderWeatherIcon(iconName) {
      switch(iconName) {
        case "zachmurzeniecalkowite.jpg":
          return this.renderIcon("Cloud");
        default:
          return this.renderIcon("Sun");
      }
  }

  renderIcon(iconName) {
    let source = "";

    switch (iconName) {
      case "Cloud":
        source = require("./icons/Cloud.svg");
        break;
      default:
        source = require("./icons/Sun.svg");
        break;
    }

    return (
      <SvgUri
        width="30"
        height="30"
        style={styles.todaylWeatherIcon}
        source={source}
      />
    )
  }

  renderDaysWeather() {
    return this.state.daysWeather.map((day, index) => this.renderDayWeather(day, index));
  }

  renderDayWeather(day, index) {
    return (
      <View
        style={[styles.dayWeather, styles[`is-${index}-day`]]}
        key={index}
      >
        <View style={styles.dayWeatherIcon}>
          {this.renderIcon(day.icon)}
        </View>
        <View style={styles.dayWeatherName}>
          <Text style={styles.dayWeatherNameDay}>
            {day.dayName}
          </Text>
          <Text style={styles.dayWeatherNameDate}>
            {day.date}
          </Text>
        </View>
        <View style={styles.dayWeatherTempContainer}>
          <Text style={styles.dayWeatherTempTitle}>min.</Text>
          <View style={styles.dayWeatherTemp}>
            <Text style={styles.dayWeatherTempValue}>
              {day.tempMin}
            </Text>
            <Text style={styles.dayWeatherTempSymbol}>
              &deg;C
            </Text>
          </View>
        </View>
        <View style={styles.dayWeatherTempContainer}>
          <Text style={styles.dayWeatherTempTitle}>max.</Text>
          <View style={styles.dayWeatherTemp}>
            <Text style={styles.dayWeatherTempValue}>
              {day.tempMax}
            </Text>
            <Text style={styles.dayWeatherTempSymbol}>
              &deg;C
            </Text>
          </View>
        </View>
      </View>
    );
  }

  renderWeather() {
    return !this.state.isLoading && this.state.daysWeather.length ? (
      <View style={styles.todayContainer}>
        <Text style={styles.todayTitle}>
          {this.state.daysWeather[0].dayName}, {this.state.daysWeather[0].date}
        </Text>
        <View style={styles.todayWeather}>
          <View style={styles.todayTempContainer}>
            <Text style={styles.todayTemp}>
              {this.state.actualTemp}
            </Text>
          </View>
          <View style={styles.todaySymbolsContainer}>
            <View style={styles.todayDegreesContainer}>
              <Text style={styles.todayDegrees}>
                &deg;C
              </Text>
            </View>
            <View style={styles.todayWeatherIconContainer}>
              {this.renderWeatherIcon(this.state.daysWeather[0].icon)}
            </View>
          </View>
        </View>
      </View>
    ) : null;
  }

  renderWeekWeather() {
    return !this.state.isLoading && this.state.daysWeather.length ? (
      <View style={styles.weekContainer}>
        {this.renderDaysWeather()}
      </View>
    ) : null;
  }

  render() {
    const {height, width} = Dimensions.get("window");
    return (
      <View style={[styles.container, {height: height}]} onLayout={this.updateLayoutProperties}>
        <ScrollView contentContainerStyle={{width: width}}>
          {this.renderLoader()}
          {this.renderWeather()}
          {this.renderWeekWeather()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  todayContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20
  },
  todayTitle: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    flex: 0
  },
  todayWeather: {
    flexDirection: "row",
    flex: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  todayTempContainer: {
    flex: 0,
  },
  todaySymbolsContainer: {
    flex: 0,
    flexDirection: "column",
  },
  todayTemp: {
    fontSize: 80,
    color: "#fff",
    textAlign: "right",
    paddingRight: 10
  },
  todayDegrees: {
    fontSize: 24,
    color: "#fff"
  },
  todaylWeatherIcon: {
    width: 20,
    height: 20
  },
  weekContainer: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "stretch",
    backgroundColor:"green"
  },
  dayWeather: {
    backgroundColor: "#2196F3",
    flex: 1,
    padding: 10,
    flexShrink: 0,
    minHeight: 50,
    flexDirection: "row"
  },
  "is-0-day": {
    backgroundColor: "#1E88E5"
  },
  "is-1-day": {
    backgroundColor: "#1976D2"
  },
  "is-2-day": {
    backgroundColor: "#1565C0"
  },
  "is-3-day": {
    backgroundColor: "#0D47A1"
  },
  "is-4-day": {
    backgroundColor: "#1565C0"
  },
  "is-5-day": {
    backgroundColor: "#1976D2"
  },
  "is-6-day": {
    backgroundColor: "#1E88E5"
  },
  dayWeatherIcon: {
    flex: 1
  },
  dayWeatherName: {
    flex: 4
  },
  dayWeatherNameDay: {
    fontSize: 14,
    color: "#fff"
  },
  dayWeatherNameDate: {
    fontSize: 22,
    color: "#fff"
  },
  dayWeatherTempContainer: {
    flex: 3,
    paddingLeft: 10
  },
  dayWeatherTempTitle: {
    fontSize: 12,
    color: "#fff"
  },
  dayWeatherTemp: {
    flexDirection: "row"
  },
  dayWeatherTempValue: {
    fontSize: 24,
    color: "#fff"
  },
  dayWeatherTempSymbol: {
    fontSize: 12,
    color: "#fff",
    marginTop: 2,
    marginLeft: 2
  }
});

AppRegistry.registerComponent('PogodaWToruniu', () => PogodaWToruniu);
