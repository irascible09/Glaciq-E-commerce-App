import React, { createContext, useState, useEffect } from 'react'
import api from '../src/utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AuthContext = createContext()

const AUTH_KEY = '@auth'

const AuthProvider = ({ children }) => {
    const [state, setstate] = useState({
        user: null,
        accessToken: '',
        refreshToken: '',
        loading: true,
        hasSeenIntro: false,
        admin: null,
        adminToken: '',
    })

    /* -------- API SETUP -------- */
    useEffect(() => {
        if (state.accessToken) {
            api.defaults.headers.common['Authorization'] =
                `Bearer ${state.accessToken}`
        } else {
            delete api.defaults.headers.common['Authorization']
        }
    }, [state.accessToken])

    /* -------- LOAD AUTH FROM STORAGE -------- */
    useEffect(() => {
        const loadAuth = async () => {
            try {

                const data = await AsyncStorage.getItem(AUTH_KEY)
                const intro = await AsyncStorage.getItem('hasSeenIntro')

                // Admin Load
                const adminToken = await AsyncStorage.getItem('adminToken')
                const adminData = await AsyncStorage.getItem('admin')

                let parsedAdmin = null
                if (adminData) parsedAdmin = JSON.parse(adminData)

                if (data) {
                    const parsed = JSON.parse(data)
                    setstate({
                        user: parsed.user,
                        accessToken: parsed.accessToken,
                        refreshToken: parsed.refreshToken,
                        loading: false,
                        hasSeenIntro: intro === 'true',
                        admin: parsedAdmin,
                        adminToken: adminToken || '',
                    })
                } else {
                    setstate(prev => ({
                        ...prev,
                        loading: false,
                        hasSeenIntro: intro === 'true',
                        admin: parsedAdmin,
                        adminToken: adminToken || '',
                    }))
                }
            } catch (e) {
                console.log('Auth restore failed', e)
                setstate(prev => ({ ...prev, loading: false }))
            }
        }

        loadAuth()
    }, [])

    /* -------- LOGIN (EMAIL / GOOGLE) -------- */
    const login = async (user, accessToken, refreshToken) => {
        const authData = { user, accessToken, refreshToken }
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData))

        setstate(prev => ({
            ...prev,
            user,
            accessToken,
            refreshToken,
            loading: false,
        }))
    }

    /* -------- ADMIN LOGIN HELPER -------- */
    const setAdminLogin = async (adminData, token) => {
        setstate(prev => ({
            ...prev,
            admin: adminData,
            adminToken: token
        }))
    }
    /* -------- LOGOUT -------- */
    const logout = async () => {
        try {
            await api.post('/auth/logout')
        } catch (err) {
            // backend logout failure can be ignored
        }

        await AsyncStorage.removeItem(AUTH_KEY)

        // Also clear admin
        await AsyncStorage.removeItem('adminToken')
        await AsyncStorage.removeItem('admin')

        setstate(prev => ({
            ...prev,
            user: null,
            accessToken: '',
            refreshToken: '',
            loading: false,
            admin: null,
            adminToken: '',
        }))
    }


    /* -------- REFRESH TOKEN -------- */
    const refreshAccessToken = async () => {
        try {
            const response = await api.post('/auth/refresh-token', {
                refreshToken: state.refreshToken,
            })

            const { accessToken, refreshToken } = response.data

            const updatedAuth = {
                user: state.user,
                accessToken,
                refreshToken,
            }

            await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updatedAuth))

            setstate(prev => ({
                ...prev,
                accessToken,
                refreshToken,
            }))

            return accessToken
        } catch (err) {
            console.log('Refresh failed, logging out')
            logout()
            return null
        }
    }


    /* -------- COMPLETE INTRO -------- */
    const completeIntro = async () => {
        await AsyncStorage.setItem('hasSeenIntro', 'true')
        setstate(prev => ({ ...prev, hasSeenIntro: true }))
    }




    return (
        <AuthContext.Provider
            value={{
                state,
                login,
                logout,
                refreshAccessToken,
                completeIntro,
                setAdminLogin,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }
