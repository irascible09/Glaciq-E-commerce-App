import React, { useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { CartContext } from '../../../context/CartContext'

const GOLD = '#c5a330'

const PRODUCTS = [
  {
    id: '1',
    name: 'Premium Water Bottle (500ml)',
    price: 99,
    image: require('../../../assets/images/glass-bottle-with-silver-cap-realistic-plastic-bottle-for-water-on-a-white-background-3d-render-2H4F0CM.jpg'),
  },
  {
    id: '2',
    name: '6-Pack Sparkling Water',
    price: 499,
    image: require('../../../assets/images/glass-bottle-with-silver-cap-realistic-plastic-bottle-for-water-on-a-white-background-3d-render-2H4F0CM.jpg'),
  },
  {
    id: '3',
    name: 'Healthy Hydration Plan',
    price: 1499,
    subscription: true,
    image: require('../../../assets/images/glass-bottle-with-silver-cap-realistic-plastic-bottle-for-water-on-a-white-background-3d-render-2H4F0CM.jpg'),
  },
  {
    id: '4',
    name: 'Monthly Hydration Plan',
    price: 1499,
    subscription: true,
    image: require('../../../assets/images/glass-bottle-with-silver-cap-realistic-plastic-bottle-for-water-on-a-white-background-3d-render-2H4F0CM.jpg'),
  },
]

// Product Card Component (same as Home)
// Import the default image
const DEFAULT_PRODUCT_IMAGE = require('../../../assets/images/bottlepack.png');

const ProductCard = ({ product, navigation }) => {
  const { cartItems, addToCart, decreaseQty } = useContext(CartContext)

  const item = cartItems.find(i => i.id === product.id)
  const qty = item?.quantity || 0

  // For subscription products
  if (product.subscription) {
    return (
      <View style={styles.card}>
        <Image
          source={DEFAULT_PRODUCT_IMAGE}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>₹{product.price}/mo</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Subscriptions')}
        >
          <Text style={styles.addButtonText}>Subscribe</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <Image
        source={DEFAULT_PRODUCT_IMAGE}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>

      {qty === 0 ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(product)}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => decreaseQty(product.id)}>
            <Text style={styles.qtyBtn}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{qty}</Text>
          <TouchableOpacity onPress={() => addToCart(product)}>
            <Text style={styles.qtyBtn}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

import { fetchStoreConfig, fetchProducts } from '../../api/userApi';
import { useState, useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function Shop({ navigation }) {
  const { totalQuantity } = useContext(CartContext)
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);

  // Banner Refs & State
  const bannerRef = useRef(null)
  const autoSlideRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetchStoreConfig().then(config => {
      if (config && config.bulkDiscounts) {
        setOffers(config.bulkDiscounts);
      }
    });

    fetchProducts().then(data => {
      if (data) setProducts(data);
    });
  }, []);

  // Auto-slide Logic
  useEffect(() => {
    if (offers.length > 1) {
      startAutoSlide();
      return stopAutoSlide;
    }
  }, [activeIndex, offers.length]);

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideRef.current = setInterval(() => {
      const next = (activeIndex + 1) % offers.length;
      bannerRef.current?.scrollToOffset({
        offset: next * (width - 32), // Width minus padding
        animated: true,
      });
      setActiveIndex(next);
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  const onScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
    setActiveIndex(index);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GLACIQ</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartIconWrapper}
        >
          <FontAwesome name="shopping-cart" size={22} color="#333" />
          {totalQuantity > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalQuantity}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Moving Discount Banner */}
      {offers.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <FlatList
            ref={bannerRef}
            data={offers}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            onMomentumScrollEnd={onScrollEnd}
            onTouchStart={stopAutoSlide}
            onTouchEnd={startAutoSlide}
            renderItem={({ item }) => (
              <View style={styles.bannerSlide}>
                <Text style={styles.bannerText}>
                  🔥 Order above ₹{item.minOrderValue} & get {item.discountPercentage}% OFF!
                </Text>
              </View>
            )}
          />

          {/* Dots */}
          {offers.length > 1 && (
            <View style={styles.dots}>
              {offers.map((_, i) => (
                <View key={i} style={[styles.dot, activeIndex === i && styles.activeDot]} />
              ))}
            </View>
          )}
        </View>
      )}


      {/* Product Grid */}
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} navigation={navigation} />}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 50,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  cartIconWrapper: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: GOLD,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontWeight: '800',
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: GOLD,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 36,
  },
  qtyBtn: {
    fontSize: 20,
    fontWeight: '700',
    color: GOLD,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
  },
  bannerSlide: {
    backgroundColor: '#fff9c4',
    padding: 20,
    borderRadius: 12,
    width: width - 32, // Full width minus container padding
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fbc02d',
    height: 80
  },
  bannerText: {
    color: '#f57f17',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center'
  },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#eee', margin: 4 },
  activeDot: { backgroundColor: '#fbc02d' }
})
