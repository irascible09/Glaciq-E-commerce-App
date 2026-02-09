import React, { useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { AuthContext } from '@/context/authContext'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

const ProfileScreen = ({ navigation }) => {
  const { state, logout } = useContext(AuthContext)
  const user = state.user

  const profileImage =
    user?.photo || user?.picture || user?.image || null

  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : '?'

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.initial}>{initial}</Text>
          </View>
        )}

        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.phone}>{user?.phone || user?.email}</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <MenuItem
          icon="receipt-outline"
          label="My Orders"
          onPress={() => navigation.navigate('Orders')}
        />
        <MenuItem
          icon="calendar-outline"
          label="Subscription Plans"
          onPress={() => navigation.navigate('Subscriptions')}
        />
        <MenuItem
          icon="location-outline"
          label="Saved Addresses"
          onPress={() => navigation.navigate('SavedAddresses')}
        />
        <MenuItem
          icon="card-outline"
          label="Payment Methods"
        />
        <MenuItem
          icon="headset-outline"
          label="Support & FAQs"
          onPress={() => navigation.navigate('Support')}
        />
        {/* <MenuItem
          icon="settings-outline"
          label="Settings"
        /> */}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#B59A3A" />
    <Text style={styles.menuText}>{label}</Text>
    <MaterialIcons
      name="keyboard-arrow-right"
      size={24}
      color="#B59A3A"
      style={{ marginLeft: 'auto' }}
    />
  </TouchableOpacity>
)

export default ProfileScreen

const GOLD = '#B59A3A'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: GOLD,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarFallback: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: GOLD,
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  phone: {
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  editBtn: {
    marginTop: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editText: {
    color: GOLD,
    fontWeight: '600',
  },
  menu: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    marginLeft: 14,
    fontSize: 16,
  },
  logoutBtn: {
    margin: 20,
    backgroundColor: GOLD,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

