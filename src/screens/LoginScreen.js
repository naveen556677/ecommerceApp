import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useAuthStore } from '../store/useAuthStore';



export default function LoginScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const { user, setUser, setToken } = useAuthStore();

    // 👇 Configure Google Sign-In once
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '670091049504-i7sdon9reu5i80vb8qbt996j14q62383.apps.googleusercontent.com', 
            offlineAccess: true,
        });
    }, []);

    // Auto redirect if already logged inx
    useEffect(() => {
        if (user) {
            navigation.replace('Products');
        }
    }, [user]);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setUser(userInfo.user);
            setToken(userInfo.idToken);
            navigation.replace('Products');
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert('Cancelled', 'You cancelled sign in.');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Alert.alert('In Progress', 'Sign in already in progress.');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Play Services not available.');
            } else {
                Alert.alert('Error', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* App Logo */}
            <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/732/732200.png' }}
                style={styles.logo}
            />

            <Text style={styles.title}>Welcome to ShopNow</Text>
            <Text style={styles.subtitle}>Your one-stop shop for everything!</Text>

            <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Image
                            source={{
                                uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Google_%22G%22_Logo.svg',
                            }}
                            style={styles.googleIcon}
                        />
                        <Text style={styles.googleText}>Sign in with Google</Text>
                    </>
                )}
            </TouchableOpacity>

            <Text style={styles.footer}>Powered by React Native CLI</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingHorizontal: 20,
    },
    logo: {
        width: 90,
        height: 90,
        marginBottom: 25,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 40,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4285F4',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    googleIcon: {
        width: 22,
        height: 22,
        marginRight: 10,
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    googleText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        fontSize: 13,
        color: '#9ca3af',
    },
});