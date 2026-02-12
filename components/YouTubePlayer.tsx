import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  videoUrl: string;
}

export default function YouTubePlayer({ videoUrl }: Props) {
  const [loading, setLoading] = useState(true);

  // Extract YouTube video ID from URL
  const getVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(videoUrl);

  console.log('YouTubePlayer - videoUrl:', videoUrl);
  console.log('YouTubePlayer - videoId:', videoId);

  if (!videoId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid YouTube URL: {videoUrl}</Text>
      </View>
    );
  }

  // Enhanced embed URL with better autoplay support
  // Add origin parameter for better compatibility (only on web)
  const getOrigin = (): string => {
    try {
      // @ts-ignore - window may not exist in React Native
      if (typeof window !== 'undefined' && (window as any).location) {
        // @ts-ignore
        return (window as any).location.origin;
      }
    } catch (e) {
      // Ignore errors in React Native environment
    }
    return '';
  };
  const origin = getOrigin();
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0&enablejsapi=1&playsinline=1&iv_load_policy=3${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`;
  
  console.log('YouTubePlayer - embedUrl:', embedUrl);

  // For web platform, use direct iframe (more reliable for YouTube)
  if (Platform.OS === 'web') {
    // Use React Native Web's View with iframe
    const iframeStyle = {
      width: '100%',
      height: '100%',
      border: 'none',
      position: 'absolute' as const,
      top: 0,
      left: 0,
    };

    return (
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF0000" />
          </View>
        )}
        {/* @ts-ignore - iframe is valid in React Native Web */}
        <iframe
          src={embedUrl}
          style={iframeStyle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          onLoad={() => {
            console.log('YouTube iframe loaded successfully');
            setLoading(false);
          }}
          onError={() => {
            console.error('YouTube iframe error');
            setLoading(false);
          }}
        />
      </View>
    );
  }

  // For native platforms (iOS, Android), use WebView
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF0000" />
        </View>
      )}
      <WebView
        source={{ uri: embedUrl }}
        style={styles.webview}
        onLoadStart={() => {
          console.log('YouTube WebView load started');
          setLoading(true);
        }}
        onLoadEnd={() => {
          console.log('YouTube WebView load ended');
          setLoading(false);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
          setLoading(false);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error: ', nativeEvent);
          setLoading(false);
        }}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        originWhitelist={['*']}
        mixedContentMode="always"
        androidHardwareAccelerationDisabled={false}
        androidLayerType="hardware"
        cacheEnabled={true}
        incognito={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  webview: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

