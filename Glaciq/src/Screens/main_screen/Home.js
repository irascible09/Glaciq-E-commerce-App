import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useRef, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { CartContext } from '../../../context/CartContext'
import { useContext } from 'react'
import api from '../../utils/api'


const { width } = Dimensions.get('window')
const BANNER_HEIGHT = 170

const banners = [
  {
    id: '1',
    text: ['Hydrate.', 'Refresh.', 'Enjoy.'],
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504',
  },
  {
    id: '2',
    text: ['Pure.', 'Premium.', 'Natural.'],
    image: 'https://plus.unsplash.com/premium_photo-1763737574962-6bc6cb92c6de?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
]

export default function Home() {

  const { addToCart } = useContext(CartContext)
  const { cartItems } = useContext(CartContext)

  const bannerRef = useRef(null)
  const autoSlideRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const navigation = useNavigation()

  //auto slide
  const startAutoSlide = () => {
    stopAutoSlide()
    autoSlideRef.current = setInterval(() => {
      if (isPaused) return
      const next = (activeIndex + 1) % banners.length
      bannerRef.current?.scrollToOffset({
        offset: next * width,
        animated: true,
      })
      setActiveIndex(next)
    }, 3000)
  }

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current)
      autoSlideRef.current = null
    }
  }

  useEffect(() => {
    startAutoSlide()
    return stopAutoSlide
  }, [activeIndex, isPaused])

  //dot sync
  const onScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width)
    setActiveIndex(index)
  }

  const { totalQuantity } = useContext(CartContext)


  // Fetch Best Sellers
  const [bestSellers, setBestSellers] = useState([])
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await api.get('/auth/products/best-sellers')
        if (response.data.success) {
          setBestSellers(response.data.products)
        }
      } catch (e) {
        console.log("Failed to fetch best sellers", e)
      }
    }
    fetchBestSellers()
  }, [])



  return (
    <FlatList
      data={[1]}
      keyExtractor={() => 'home'}
      ListHeaderComponent={
        <View>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.logo}>GLACIQ</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart')}
              style={styles.cartIconWrapper}
            >
              <FontAwesome name="shopping-cart" size={22} color="#333" />

              {totalQuantity > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {totalQuantity}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* BANNER CONTAINER */}
          <View style={{ height: BANNER_HEIGHT }}>
            <FlatList
              ref={bannerRef}
              data={banners}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              onMomentumScrollEnd={onScrollEnd}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              renderItem={({ item }) => (
                <View style={styles.banner}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
                  <View style={styles.bannerOverlay}>
                    {item.text.map((t, i) => (
                      <Text key={i} style={styles.bannerText}>{t}</Text>
                    ))}
                  </View>
                </View>
              )}
            />
          </View>

          {/* DOTS */}
          <View style={styles.dots}>
            {banners.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, activeIndex === i && styles.activeDot]}
              />
            ))}
          </View>

          {/* QUICK ACTIONS */}
          <View style={styles.quickActions}>
            <QuickItem icon="shopping-bag" label="Shop Now" onPress={() => navigation.navigate('Shop')} />
            <QuickItem icon="local-shipping" label="Track Order" onPress={() => navigation.navigate('TrackOrder')} />
            <QuickItem icon="autorenew" label="Subscriptions" onPress={() => navigation.navigate('Subscriptions')} />
            <QuickItem icon="support-agent" label="Support" onPress={() => navigation.navigate('Support')} />
          </View>

          <Text style={styles.sectionTitle}>Best Sellers</Text>
        </View>
      }
      renderItem={() => (
        <View>
          <View style={styles.productRow}>
            {bestSellers.length > 0 ? (
              bestSellers.map(item => (
                <ProductCard
                  key={item.id}
                  product={{
                    id: item.id,
                    title: item.name,
                    price: item.price,
                    image: item.image ? { uri: item.image } : { uri: 'https://via.placeholder.com/150' }, // fallback
                  }}
                />
              ))
            ) : (
              <Text style={{ paddingHorizontal: 16, color: '#777' }}>No best sellers yet.</Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>What Our Customers Say</Text>

          <View style={styles.reviewCard}>
            <Text style={styles.reviewText}>
              “Excellent quality and taste. Delivery was super quick!”
            </Text>
            <View style={styles.reviewFooter}>
              <View style={{ flexDirection: 'row' }}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesome key={i} name="star" size={14} color="#c5a330" />
                ))}
              </View>
              <Text style={styles.reviewer}>— Saromi</Text>
            </View>
          </View>

          <View style={{ height: 30 }} />
        </View>
      )}
    />
  )
}

/* ---------- COMPONENTS ---------- */

const QuickItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.quickItem} onPress={onPress}>
    <MaterialIcons name={icon} size={22} color="#c5a330" />
    <Text style={styles.quickLabel}>{label}</Text>
  </TouchableOpacity>
)

const DEFAULT_PRODUCT_IMAGE = require('../../../assets/images/bottlepack.png');

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, decreaseQty } = useContext(CartContext)
  const navigation = useNavigation()

  const item = cartItems.find(i => i.id === product.id)
  const qty = item?.quantity || 0

  return (
    <View style={styles.productCard}>
      {/* Ensure width handling if using map instead of 2-col hardcode */}
      <Image source={DEFAULT_PRODUCT_IMAGE} style={styles.productImage} />

      <Text style={styles.productTitle}>{product.title}</Text>
      <Text style={styles.productPrice}>₹{product.price}</Text>

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


/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    marginBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  logo: { fontSize: 22, fontWeight: '800' },

  banner: { width, height: BANNER_HEIGHT },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { position: 'absolute', left: 20, top: 40 },
  bannerText: { color: '#fff', fontSize: 20, fontWeight: '800' },

  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd', margin: 4 },
  activeDot: { backgroundColor: '#c5a330' },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 25,
  },

  quickItem: { alignItems: 'center', width: '22%' },
  quickLabel: { fontSize: 11, marginTop: 6 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 25,
    flexWrap: 'wrap', // Allow wrapping for more than 2 products
  },

  productCard: {
    width: '48%', // Keeps 2 col layout
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    justifyContent: 'space-between',
    marginBottom: 15, // added margin bottom for wrapped rows
  },

  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    marginBottom: 10,
  },

  productTitle: { fontWeight: '600' },
  productPrice: { fontWeight: '800', marginVertical: 5 },

  addButton: {
    backgroundColor: '#c5a330',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
  },

  addButtonText: { color: '#fff', fontWeight: '600' },

  reviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },

  reviewText: { marginBottom: 10 },
  reviewFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewer: { fontWeight: '600' },

  cartIconWrapper: {
    position: 'relative',
  },

  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#c5a330',
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

  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 36,
  },

  qtyBtn: {
    fontSize: 20,
    fontWeight: '700',
    color: '#c5a330',
  },

  qtyText: {
    fontSize: 16,
    fontWeight: '700',
  },


})
