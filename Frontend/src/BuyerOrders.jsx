
import { useEffect, useState } from 'react';

function BuyerOrders({ setCurrentPage }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');

        try {
            setLoading(true);
            setError('');

            const response = await fetch(
                'http://localhost:3000/api/orders/buyer',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to retrieve orders.');
            }

            setOrders(data.orders || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const cancelOrder = async (orderId) => {
        const confirmed = window.confirm(
            'Are you sure you want to cancel this order?'
        );

        if (!confirmed) return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(
                `http://localhost:3000/api/orders/${orderId}/cancel`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to cancel order.');
            }

            alert('Order cancelled successfully!');
            await fetchOrders();
        } catch (err) {
            alert(err.message);
        }
    };

    const getStatusClass = (status) => {
        const normalizedStatus = status?.toLowerCase();

        if (normalizedStatus === 'pending') return 'pending';
        if (normalizedStatus === 'accepted') return 'accepted';
        if (normalizedStatus === 'completed') return 'completed';
        if (normalizedStatus === 'rejected') return 'rejected';
        if (normalizedStatus === 'cancelled') return 'cancelled';

        return 'unknown';
    };

    const formatPrice = (amount) =>
        Number(amount || 0).toLocaleString('en-US');

    if (loading) {
        return (
            <div className="buyer-orders-page">
                <div className="orders-loading">
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="buyer-orders-page">

            <nav className="buyer-orders-nav">
                <h2>FarmConnect</h2>

                <ul>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage('buyerDashboard');
                            }}
                        >
                            Dashboard
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage('products');
                            }}
                        >
                            Shop Products
                        </a>
                    </li>
                </ul>
            </nav>

            <section className="buyer-orders-header">
                <span className="orders-subtitle">YOUR PURCHASES</span>
                <h1>My Orders</h1>
                <p>
                    Keep track of your purchases and monitor your order status.
                </p>

                <div className="orders-count">
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </div>
            </section>

            <main className="buyer-orders-main">

                {error && (
                    <div className="orders-error-message" role="alert">
                        {error}
                        <button onClick={fetchOrders}>
                            Try Again
                        </button>
                    </div>
                )}

                {!error && orders.length === 0 ? (
                    <div className="buyer-orders-empty">
                        <h2>No orders yet</h2>
                        <p>
                            You haven't purchased any farm products yet.
                            Start exploring fresh products from farmers.
                        </p>

                        <button
                            onClick={() => setCurrentPage('products')}
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="buyer-orders-container">
                        {orders.map((order) => (
                            <article className="order-card" key={order._id}>

                                <div className="order-card-header">
                                    <div>
                                        <span className="order-label">
                                            ORDER REFERENCE
                                        </span>
                                        <h3>#{String(order._id).slice(-8)}</h3>
                                    </div>

                                    <span
                                        className={`order-status ${getStatusClass(order.status)}`}
                                    >
                                        {order.status || 'Unknown'}
                                    </span>
                                </div>

                                <div className="order-date">
                                    <strong>Order Date:</strong>{' '}
                                    {order.createdAt
                                        ? new Date(order.createdAt).toLocaleString()
                                        : 'Not available'}
                                </div>

                                <div className="order-products-section">
                                    <h4>Ordered Products</h4>

                                    {order.items?.map((item, index) => (
                                        <div
                                            className="order-product"
                                            key={item.productId || index}
                                        >
                                            <div className="order-product-info">
                                                <strong>{item.name}</strong>
                                                <span>
                                                    Quantity: {item.quantity}
                                                </span>
                                            </div>

                                            <div className="order-product-price">
                                                <span>
                                                    {formatPrice(item.price)} FCFA
                                                </span>
                                                <strong>
                                                    {formatPrice(
                                                        item.subtotal ??
                                                        item.price * item.quantity
                                                    )} FCFA
                                                </strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-total">
                                    <span>Total Amount</span>
                                    <strong>
                                        {formatPrice(order.totalAmount)} FCFA
                                    </strong>
                                </div>

                                <div className="order-delivery-section">
                                    <h4>Delivery Information</h4>

                                    <p>
                                        <strong>Address:</strong>{' '}
                                        {order.deliveryAddress || 'Not provided'}
                                    </p>

                                    <p>
                                        <strong>Phone:</strong>{' '}
                                        {order.phone || 'Not provided'}
                                    </p>
                                </div>

                                {order.status?.toLowerCase() === 'pending' && (
                                    <div className="order-actions">
                                        <button
                                            className="cancel-order-button"
                                            onClick={() => cancelOrder(order._id)}
                                        >
                                            Cancel Order
                                        </button>
                                    </div>
                                )}

                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default BuyerOrders;
