import { useEffect, useState } from "react";
import { View, Text, SectionList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Alert, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { fetchAllOrders, assignDeliveryPartner } from "../../src/api/admin/adminOrderApi";
import { fetchPartners } from "../../src/api/admin/adminDeliveryApi";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [partners, setPartners] = useState([]);
    const [pastFilter, setPastFilter] = useState('ALL');

    const loadData = async () => {
        setLoading(true);
        try {
            const orderRes = await fetchAllOrders();
            const partnerRes = await fetchPartners();

            // Show ALL orders, sorted by date (Backend sorts by createdAt desc already)
            setOrders(orderRes.data);
            setPartners(partnerRes.data);
        } catch (error) {
            console.error("Failed to load data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PLACED': return { bg: '#fff8e1', text: '#ffa000' }; // Gold/Amber
            case 'OUT_FOR_DELIVERY': return { bg: '#e3f2fd', text: '#1976d2' }; // Blue
            case 'DELIVERED': return { bg: '#e8f5e9', text: '#2e7d32' }; // Green
            case 'CANCELLED': return { bg: '#ffebee', text: '#c62828' }; // Red
            default: return { bg: '#f5f5f5', text: '#757575' }; // Grey
        }
    };

    // Prepare Section Data
    const activeOrders = orders.filter(o => ['PLACED', 'OUT_FOR_DELIVERY'].includes(o.orderStatus));
    let pastOrders = orders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.orderStatus));

    if (pastFilter !== 'ALL') {
        pastOrders = pastOrders.filter(o => o.orderStatus === pastFilter);
    }

    const sections = [
        { title: 'Active Orders', data: activeOrders },
        { title: 'Past Orders', data: pastOrders }
    ];

    const renderSectionHeader = ({ section: { title } }) => {
        if (title === 'Past Orders') {
            return (
                <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                    <View style={styles.filterRow}>
                        {['ALL', 'DELIVERED', 'CANCELLED'].map((filter) => (
                            <TouchableOpacity
                                key={filter}
                                style={[styles.filterChip, pastFilter === filter && styles.filterChipActive]}
                                onPress={() => setPastFilter(filter)}
                            >
                                <Text style={[styles.filterText, pastFilter === filter && styles.filterTextActive]}>
                                    {filter === 'ALL' ? 'All' : filter.charAt(0) + filter.slice(1).toLowerCase()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
        );
    };

    const [selectedOrder, setSelectedOrder] = useState(null);

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#c6a32f" /></View>;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>All Orders</Text>
                <TouchableOpacity onPress={loadData} style={styles.refreshBtn}>
                    <MaterialIcons name="refresh" size={24} color="#646369" />
                </TouchableOpacity>
            </View>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingBottom: 20 }}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={renderSectionHeader}
                renderItem={({ item }) => {
                    const colors = getStatusColor(item.orderStatus);
                    return (
                        <TouchableOpacity onPress={() => openOrderDetails(item)} activeOpacity={0.8}>
                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.idText}>#{item.orderNumber || item._id.slice(-6).toUpperCase()}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                                        <Text style={[styles.statusText, { color: colors.text }]}>
                                            {item.orderStatus.replace(/_/g, ' ')}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.detailText}>Total: ₹{item.totalAmount}</Text>
                                <Text style={styles.detailText}>User: {item.userInfo?.name || 'Guest'}</Text>
                                <Text style={styles.detailText}>Items: {item.items.length}</Text>
                                <Text style={styles.detailText}>
                                    Partner: {item.deliveryPartner ? (partners.find(p => p._id === item.deliveryPartner)?.name || 'Unknown') : 'Unassigned'}
                                </Text>
                                {item.deliveredAt && (
                                    <Text style={[styles.detailText, { fontSize: 12, marginTop: 5 }]}>
                                        Delivered: {new Date(item.deliveredAt).toLocaleDateString()}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                }}
                renderSectionFooter={({ section }) => {
                    if (section.data.length === 0) {
                        return <Text style={styles.emptySectionText}>No {section.title.toLowerCase()}</Text>;
                    }
                    return null;
                }}
            />

            {/* Order Details Modal */}
            <Modal
                visible={!!selectedOrder}
                animationType="slide"
                transparent={true}
                onRequestClose={closeOrderDetails}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Order Details</Text>
                            <TouchableOpacity onPress={closeOrderDetails}>
                                <MaterialIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {selectedOrder && (
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalBody}>
                                <View style={[styles.statusBanner, { backgroundColor: getStatusColor(selectedOrder.orderStatus).bg }]}>
                                    <Text style={[styles.statusBannerText, { color: getStatusColor(selectedOrder.orderStatus).text }]}>
                                        {selectedOrder.orderStatus.replace(/_/g, ' ')}
                                    </Text>
                                    <Text style={styles.dateText}>
                                        Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                                    </Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionHead}>Customer Info</Text>
                                    <Text style={styles.infoText}><Text style={styles.bold}>Name:</Text> {selectedOrder.userInfo?.name}</Text>
                                    <Text style={styles.infoText}><Text style={styles.bold}>Phone:</Text> {selectedOrder.userInfo?.phone}</Text>
                                    <Text style={styles.infoText}><Text style={styles.bold}>Email:</Text> {selectedOrder.userInfo?.email}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionHead}>Delivery Address</Text>
                                    <Text style={styles.infoText}>
                                        {selectedOrder.deliveryAddress?.name}
                                    </Text>
                                    <Text style={styles.infoText}>{selectedOrder.deliveryAddress?.line1}</Text>
                                    {selectedOrder.deliveryAddress?.line2 && <Text style={styles.infoText}>{selectedOrder.deliveryAddress?.line2}</Text>}
                                    <Text style={styles.infoText}>
                                        {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.pincode}
                                    </Text>
                                    <Text style={styles.infoText}>Ph: {selectedOrder.deliveryAddress?.phone}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionHead}>Order Items ({selectedOrder.items.length})</Text>
                                    {selectedOrder.items.map((item, index) => (
                                        <View key={index} style={styles.itemRow}>
                                            <View>
                                                <Text style={styles.itemName}>{item.name}</Text>
                                                <Text style={styles.itemMeta}>Qty: {item.quantity}  x  ₹{item.price}</Text>
                                            </View>
                                            <Text style={styles.itemPrice}>₹{item.subtotal}</Text>
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionHead}>Payment Details</Text>
                                    <View style={styles.paymentRow}>
                                        <Text style={styles.payLabel}>Method</Text>
                                        <Text style={styles.payValue}>{selectedOrder.paymentMethod}</Text>
                                    </View>
                                    <View style={styles.paymentRow}>
                                        <Text style={styles.payLabel}>Items Total</Text>
                                        <Text style={styles.payValue}>₹{selectedOrder.itemsTotal}</Text>
                                    </View>
                                    <View style={styles.paymentRow}>
                                        <Text style={styles.payLabel}>Delivery Fee</Text>
                                        <Text style={[styles.payValue, selectedOrder.deliveryFee === 0 && { color: 'green' }]}>
                                            {selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee}`}
                                        </Text>
                                    </View>
                                    {selectedOrder.discount > 0 && (
                                        <View style={styles.paymentRow}>
                                            <Text style={styles.payLabel}>Discount</Text>
                                            <Text style={[styles.payValue, { color: 'green' }]}>-₹{selectedOrder.discount}</Text>
                                        </View>
                                    )}
                                    <View style={[styles.paymentRow, styles.totalRow]}>
                                        <Text style={styles.totalLabel}>Grand Total</Text>
                                        <Text style={styles.totalValue}>₹{selectedOrder.totalAmount}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default OrdersPage;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fb' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    refreshBtn: { padding: 10 },

    // Section Headers
    sectionHeaderContainer: {
        backgroundColor: '#f8f9fb', // Matches background to look seamless
        paddingVertical: 10,
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#444',
        marginBottom: 10,
    },
    emptySectionText: {
        fontStyle: 'italic',
        color: '#999',
        textAlign: 'center',
        marginBottom: 20,
    },

    // Filter Chips
    filterRow: {
        flexDirection: 'row',
        gap: 10,
    },
    filterChip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
    },
    filterChipActive: {
        backgroundColor: '#c6a32f',
    },
    filterText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#555',
    },
    filterTextActive: {
        color: '#fff',
    },

    // Cards
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#ccc'
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    idText: { fontWeight: 'bold', color: '#555', fontSize: 16 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    detailText: { fontSize: 14, color: '#666', marginBottom: 4 },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '85%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalBody: {
        paddingBottom: 40,
    },
    statusBanner: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    statusBannerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    dateText: {
        color: '#666',
        fontSize: 12,
    },
    section: {
        marginBottom: 25,
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 12,
    },
    sectionHead: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
        color: '#444',
    },
    infoText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
        lineHeight: 20,
    },
    bold: {
        fontWeight: '600',
        color: '#333',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    itemMeta: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    payLabel: {
        color: '#666',
        fontSize: 14,
    },
    payValue: {
        color: '#333',
        fontWeight: '500',
        fontSize: 14,
    },
    totalRow: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#c6a32f',
    },
});
