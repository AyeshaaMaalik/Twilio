import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import VideoCall from './Scr/VideoCall'

const App = () => {
  return (

    <SafeAreaView style={{ flex: 1 }}>
      <VideoCall />
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({})