// import api from './api'
// import AsyncStorage from '@react-native-async-storage/async-storage'

// let isRefreshing = false
// let failedQueue = []

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(promise => {
//     if (error) promise.reject(error)
//     else promise.resolve(token)
//   })
//   failedQueue = []
// }

// const setupAxiosInterceptor = () => {
//   api.interceptors.response.use(
//     response => response,

//     async error => {
//       const originalRequest = error.config

//       if (
//         error.response?.status === 401 &&
//         !originalRequest._retry
//       ) {
//         originalRequest._retry = true

//         if (isRefreshing) {
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject })
//           }).then(token => {
//             originalRequest.headers.Authorization = `Bearer ${token}`
//             return api(originalRequest)
//           })
//         }

//         isRefreshing = true

//         try {
//           const authData = await AsyncStorage.getItem('@auth')
//           if (!authData) throw new Error('No auth data')

//           const { refreshToken } = JSON.parse(authData)

//           const res = await api.post('/auth/refresh-token', {
//             refreshToken,
//           })

//           const { accessToken, refreshToken: newRefreshToken } = res.data

//           const updatedAuth = {
//             ...JSON.parse(authData),
//             accessToken,
//             refreshToken: newRefreshToken,
//           }

//           await AsyncStorage.setItem('@auth', JSON.stringify(updatedAuth))

//           api.defaults.headers.common.Authorization =
//             `Bearer ${accessToken}`

//           processQueue(null, accessToken)

//           originalRequest.headers.Authorization =
//             `Bearer ${accessToken}`

//           return api(originalRequest)

//         } catch (err) {
//           processQueue(err, null)
//           await AsyncStorage.removeItem('@auth')
//           return Promise.reject(err)
//         } finally {
//           isRefreshing = false
//         }
//       }

//       return Promise.reject(error)
//     }
//   )
// }

// export default setupAxiosInterceptor


// axiosInterceptor.js
import api from './api'
import axiosAdmin from '../api/admin/axiosAdmin'
import AsyncStorage from '@react-native-async-storage/async-storage'

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(promise => {
    if (error) promise.reject(error)
    else promise.resolve(token)
  })
  failedQueue = []
}

// must NEVER trigger refresh
const AUTH_EXCLUDED_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/google',
  '/auth/refresh-token',
  '/admin/login',
]

const setupAxiosInterceptor = (instance, type = 'user') => {
  instance.interceptors.response.use(
    response => response,

    async error => {
      const originalRequest = error.config

      // skip refresh for auth routes
      if (
        AUTH_EXCLUDED_ROUTES.some(route =>
          originalRequest.url?.includes(route)
        )
      ) {
        return Promise.reject(error)
      }

      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true

        // Refresh logic currently only for user (api instance)
        if (type !== 'user') {
          return Promise.reject(error)
        }

        const authData = await AsyncStorage.getItem('@auth')
        if (!authData) return Promise.reject(error)

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return instance(originalRequest)
          })
        }

        isRefreshing = true

        try {
          const { refreshToken } = JSON.parse(authData)

          const res = await api.post('/auth/refresh-token', {
            refreshToken,
          })

          const { accessToken, refreshToken: newRefreshToken } = res.data

          const updatedAuth = {
            ...JSON.parse(authData),
            accessToken,
            refreshToken: newRefreshToken,
          }

          await AsyncStorage.setItem('@auth', JSON.stringify(updatedAuth))

          processQueue(null, accessToken)

          originalRequest.headers.Authorization =
            `Bearer ${accessToken}`

          return instance(originalRequest)

        } catch (err) {
          processQueue(err, null)
          await AsyncStorage.removeItem('@auth')
          return Promise.reject(err)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )
}

const setupAllInterceptors = () => {
  setupAxiosInterceptor(api, 'user');
  setupAxiosInterceptor(axiosAdmin, 'admin');
}

export default setupAllInterceptors;
