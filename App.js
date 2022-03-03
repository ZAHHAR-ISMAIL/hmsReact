/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  HmsPushInstanceId,
  HmsPushMessaging,
  RNRemoteMessage,
  HmsLocalNotification,
  HmsPushEvent,
} from "@hmscore/react-native-hms-push";


// get HCM Token 
HmsPushInstanceId.getToken('')
      .then((result) => {
        console.log('getToken', result);
      })
      .catch((err) => {
        alert('[getToken] Error/Exception: ' + JSON.stringify(err));
});

//Read Data Notification in Foreground
onRemoteMessageReceivedListener = HmsPushEvent.onRemoteMessageReceived(
  (result) => {
    const RNRemoteMessageObj = new RNRemoteMessage(result.msg);
    HmsLocalNotification.localNotification({
      [HmsLocalNotification.Attr.title]: 'DataMessage Received',
      [HmsLocalNotification.Attr.message]:
        RNRemoteMessageObj.getDataOfMap(),
    });
    console.log('onRemoteMessageReceived', result);
  },
);

//Read Data Notification in Background
HmsPushMessaging.setBackgroundMessageHandler((dataMessage) => {
  console.log('setBackgroundMessageHandler', dataMessage);
  HmsLocalNotification.localNotification({
    [HmsLocalNotification.Attr.title]: '[Headless] DataMessage Received',
    [HmsLocalNotification.Attr.message]: new RNRemoteMessage(
      dataMessage,
    ).getDataOfMap(),
  })
    .then((result) => {
      console.log('[Headless] DataMessage Received', result);
    })
    .catch((err) => {
      console.log(
        '[LocalNotification Default] Error/Exception: ' + JSON.stringify(err),
      );
    });

  return Promise.resolve();
});

// Subscribe to a Topic
HmsPushMessaging.subscribe("KFC-00")
.then((result) => {
    console.log("subscribe", result);
})
.catch((err) => {
    alert("[subscribe] Error/Exception: " + JSON.stringify(err));
    console.log(err);
});




const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  useEffect(() => {
   
    onTokenReceivedListener = HmsPushEvent.onTokenReceived((result) => {
      console.log('onTokenReceived', result);
    });
    
    onTokenErrorListener = HmsPushEvent.onTokenError((result) => {
      console.log('onTokenError', result);
    });
    
    onNotificationOpenedAppListener = HmsPushEvent.onNotificationOpenedApp(
      (result) => {
        console.log('onNotificationOpenedAppListener', result);
      },
    );

    () => {
      onTokenReceivedListener.remove();
      onTokenErrorListener.remove();
      onNotificationOpenedAppListener.remove();
    };
  }, []);


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            BBBBBBBBBBBBBBB <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
