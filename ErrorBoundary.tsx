import React, { Component, type ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.icon}>!</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>Please try again</Text>
          <TouchableOpacity onPress={this.handleRetry} style={styles.button} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F1A12', padding: 40 },
  icon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#dc262620', color: '#dc2626', fontSize: 28, fontWeight: '800', textAlign: 'center', lineHeight: 56, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '700', color: '#E8F5E9', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#A5D6A7', marginBottom: 24 },
  button: { backgroundColor: '#2E7D32', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
