import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../../../context/CartContext'

export default function Cart() {
    const navigation = useNavigation()
    const { cartItems, addToCart, decreaseQty, removeFromCart, totalPrice } = useContext(CartContext)
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const { fetchStoreConfig } = require('../../../api/userApi');
        fetchStoreConfig().then(config => {
            if (config && config.bulkDiscounts) {
                setOffers(config.bulkDiscounts);
            }
        });
    }, []);


    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={item.image} style={styles.itemImage} />

            <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>

                <View style={[styles.qtyRow, { marginTop: 8 }, { flexDirection: 'row' }, { padding: 10 }]}>
                    <TouchableOpacity onPress={() => decreaseQty(item.id)}>
                        <Text style={styles.qtyBtn}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.quantity}</Text>

                    <TouchableOpacity onPress={() => addToCart(item)}>
                        <Text style={styles.qtyBtn}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <FontAwesome name="trash" size={18} color="#c00" />
            </TouchableOpacity>
        </View>
    )


    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome name="arrow-left" size={20} />
                </TouchableOpacity>
                <Text style={styles.title}>My Cart</Text>
                <View style={{ width: 20 }} />
            </View>

            {/* OFFERS SECTION */}
            {offers.length > 0 && (
                <View style={styles.offersContainer}>
                    <Text style={styles.offerTitle}>Available Offers</Text>
                    {offers.map((offer, index) => (
                        <Text key={index} style={styles.offerText}>
                            • Order above ₹{offer.minOrderValue} for {offer.discountPercentage}% OFF
                        </Text>
                    ))}
                </View>
            )}

            {/* CART LIST */}
            {cartItems.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>
                        Your cart is empty 🛒
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={cartItems}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />

            )}

            <View style={styles.totalBar}>
                <Text style={styles.totalText}>
                    Total: ₹{totalPrice}
                </Text>
                <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => navigation.navigate('OrderStackNavigator', {
                        screen: 'SelectAddress',
                        params: { cartItems }
                    })}
                >
                    <Text style={styles.checkoutText}>Checkout</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        marginTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
    },
    offersContainer: {
        backgroundColor: '#e8f5e9',
        padding: 15,
        marginHorizontal: 16,
        borderRadius: 8,
        marginBottom: 10
    },
    offerTitle: {
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 4
    },
    offerText: {
        color: '#1b5e20',
        fontSize: 13
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
    },

    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyText: {
        fontSize: 16,
        color: '#777',
    },

    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 0.5,
        borderColor: '#eee',
    },

    itemImage: {
        width: 60,
        height: 60,
        marginRight: 12,
    },

    itemDetails: {
        flex: 1,
    },

    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
    },

    itemPrice: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: '700',
    },

    totalBar: {
        padding: 16,
        borderTopWidth: 0.5,
        borderColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    totalText: {
        fontSize: 18,
        fontWeight: '800',
    },

    checkoutBtn: {
        backgroundColor: '#c5a330',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 24,
    },

    checkoutText: {
        color: '#fff',
        fontWeight: '700',
    },

    qtyBtn: { padding: 10, fontSize: 16, fontWeight: '700' },
    qtyText: { padding: 10, fontSize: 16, fontWeight: '700' }

})
