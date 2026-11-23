
import { useEffect, useState } from 'react';

function FarmerOrders({ setCurrentPage }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');

        try {
            setLoading(true);
            setError('');

            const response = await fetch(
                'http://localhost:3000/api/orders/farmer',
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

    const updateOrderStatus = async (orderId, action) => {
        const messages = {
            accept: 'Are you sure you want to accept this order?',
            reject: 'Are you sure you want to reject this order?',
            complete: 'Mark this order as completed?'
        };

        if (!window.confirm(messages[action])) return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(
                `http://localhost:3000/api/orders/${orderId}/${action}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update order.');
            }

            alert(data.message || 'Order updated successfully!');
            await fetchOrders();
        } catch (err) {
            alert(err.message);
        }
    };

    const formatPrice = (amount) =>
        Number(amount || 0).toLocaleString('en-US');

    const getStatusClass = (status) => {
        const normalizedStatus = status?.toLowerCase();

        if (normalizedStatus === 'pending') return 'pending';
        if (normalizedStatus === 'accepted') return 'accepted';
        if (normalizedStatus === 'completed') return 'completed';
        if (normalizedStatus === 'rejected') return 'rejected';
        if (normalizedStatus === 'cancelled') return 'cancelled';

        return 'unknown';
    };

    const pendingOrders = orders.filter(
        (order) => order.status?.toLowerCase() === 'pending'
    ).length;

    if (loading) {
        return (
            <div className="farmer-orders-page">
                <div className="orders-loading">
                    <p>Loading farmer orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="farmer-orders-page">

            <nav className="farmer-orders-nav">
                <h2>FarmConnect</h2>

                <ul>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage('farmerDashboard');
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
                                setCurrentPage('myProducts');
                            }}
                        >
                            My Products
                        </a>
                    </li>
                </ul>
            </nav>

            <section className="farmer-orders-header">
                <span className="orders-subtitle">FARMER MANAGEMENT</span>

                <h1>Customer Orders</h1>

                <p>
                    Review customer purchases and manage your incoming orders.
                </p>

                <div className="farmer-order-summary">
                    <div className="farmer-order-summary-item">
                        <span>Total Orders</span>
                        <strong>{orders.length}</strong>
                    </div>

                    <div className="farmer-order-summary-item">
                        <span>Pending Orders</span>
                        <strong>{pendingOrders}</strong>
                    </div>
                </div>
            </section>

            <main className="farmer-orders-main">

                {error && (
                    <div className="orders-error-message" role="alert">
                        {error}
                        <button onClick={fetchOrders}>
                            Try Again
                        </button>
                    </div>
                )}

                {!error && orders.length === 0 ? (
                    <div className="farmer-orders-empty">
                        <h2>No customer orders yet</h2>
                        <p>
                            New customer orders for your products will
                            appear here.
                        </p>

                        <button
                            onClick={() => setCurrentPage('myProducts')}
                        >
                            View My Products
                        </button>
                    </div>
                ) : (
                    <div className="farmer-orders-container">

                        {orders.map((order) => (
                            <article className="order-card" key={order._id}>

                                <div className="order-card-header">
                                    <div>
                                        <span className="order-label">
                                            ORDER REFERENCE
                                        </span>

                                        <h3>
                                            #{String(order._id).slice(-8)}
                                        </h3>
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
                                    <h4>Products Ordered</h4>

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
                                    <span>Total Order Amount</span>

                                    <strong>
                                        {formatPrice(order.totalAmount)} FCFA
                                    </strong>
                                </div>

                                <div className="order-delivery-section">
                                    <h4>Buyer and Delivery Information</h4>

                                    <p>
                                        <strong>Delivery Address:</strong>{' '}
                                        {order.deliveryAddress || 'Not provided'}
                                    </p>

                                    <p>
                                        <strong>Phone Number:</strong>{' '}
                                        {order.phone || 'Not provided'}
                                    </p>
                                </div>

                                {order.status?.toLowerCase() === 'pending' && (
                                    <div className="farmer-order-actions">
                                        <button
                                            className="accept-order-button"
                                            onClick={() =>
                                                updateOrderStatus(order._id, 'accept')
                                            }
                                        >
                                            Accept Order
                                        </button>

                                        <button
                                            className="reject-order-button"
                                            onClick={() =>
                                                updateOrderStatus(order._id, 'reject')
                                            }
                                        >
                                            Reject Order
                                        </button>
                                    </div>
                                )}

                                {order.status?.toLowerCase() === 'accepted' && (
                                    <div className="farmer-order-actions">
                                        <button
                                            className="complete-order-button"
                                            onClick={() =>
                                                updateOrderStatus(order._id, 'complete')
                                            }
                                        >
                                            Mark as Completed
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

export default FarmerOrders;
