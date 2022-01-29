import * as WebBrowser from 'expo-web-browser';
import { useEffect } from "react";
import { Platform,  StyleSheet, TouchableOpacity } from 'react-native';
import { startActivityAsync } from 'expo-intent-launcher';

import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

const isAndroid = Platform.OS === 'android';

const getFreeSpace = async () => FileSystem.getFreeDiskStorageAsync();
const getTotalDiskCapacity = async () => FileSystem.getTotalDiskCapacityAsync();

async function testFilesystem() {
    if (isAndroid) {     // Android Storage access framework only
      // Requests permissions for external directory
      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        // Gets SAF URI from response
        const uri = permissions.directoryUri;
    
        // Gets all files inside of selected directory
        const files = await StorageAccessFramework.readDirectoryAsync(uri);
        alert(`Files inside ${uri}:\n\n${JSON.stringify(files)}`);

        FileSystem.getContentUriAsync(uri).then(cUri => {
          console.log(cUri);
          startActivityAsync('android.intent.action.VIEW', {
            data: cUri,
            flags: 1,
          });
        });
      }
    }

    getFreeSpace().then(freeDiskStorage => {
      alert(`freeDiskStorage ${JSON.stringify(freeDiskStorage, null, 2)}`)
    });

    getTotalDiskCapacity().then(totalDiskCapacity => {
      alert(`totalDiskCapacity ${JSON.stringify(totalDiskCapacity, null, 2)}`)
    });

    // downloadAsync (https://docs.expo.dev/versions/latest/sdk/filesystem/#filesystemdownloadasyncuri-fileuri-options)
    const { uri } = await FileSystem.downloadAsync(
      'http://techslides.com/demos/sample-videos/small.mp4',
      FileSystem.documentDirectory + 'small.mp4'
    )
    
    alert(`App downloaded ${await uri}`);

    // Get Info Async
    alert(`GetInfoAsync: ${ JSON.stringify(await FileSystem.getInfoAsync(uri), null, 2) }`);

    alert(`deleteAsync: ${ JSON.stringify(await FileSystem.deleteAsync(uri), null, 2) }`);

    // makeDirectoryAsync (https://docs.expo.dev/versions/latest/sdk/filesystem/#filesystemmakedirectoryasyncfileuri-options)
    alert(`makeDirectoryAsync: ${ JSON.stringify(await FileSystem.makeDirectoryAsync(uri), null, 2) }`);

    // readDirectoryAsync (https://docs.expo.dev/versions/latest/sdk/filesystem/#filesystemreaddirectoryasyncfileuri)
    alert(`readDirectoryAsync: ${ JSON.stringify(await FileSystem.readDirectoryAsync(uri), null, 2) }`);
    
    // moveAsync (https://docs.expo.dev/versions/latest/sdk/filesystem/#filesystemmoveasyncoptions)
    // alert(`moveAsync: ${ JSON.stringify(await FileSystem.moveAsync('file://url/from', 'file://url/to'), null, 2) }`);

    // copyAsync (https://docs.expo.dev/versions/latest/sdk/filesystem/#filesystemcopyasyncoptions)
    // alert(`copyAsync: ${ JSON.stringify(await FileSystem.copyAsync('file://url/from', 'file://url/to'), null, 2) }`);
    
}


export default function  EditScreenInfo({ path }: { path: string }) {
  useEffect(() => {
    testFilesystem()
  }, []);

  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Open up the code for this screen:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">
          <MonoText>{path}</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          - Download file
          - 
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
