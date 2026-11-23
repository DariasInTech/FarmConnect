
import { useState } from 'react';

function Checkout({ cart, setCart, setCurrentPage }) {
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const totalAmount = cart.reduce(
        (total, item) =>
            total + Number(item.price || 0) * Number(item.cartQuantity || 0),
        0
    );

    const totalItems = cart.reduce(
        (total, item) => total + Number(item.cartQuantity || 0),
        0
    );

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        if (!deliveryAddress.trim() || !phone.trim()) {
            alert('Please provide your delivery address and phone number.');
            return;
        }

        // Group products according to their farmers
        const farmerOrders = {};

        for (const item of cart) {
            const farmerId =
                typeof item.farmerId === 'object'
                    ? item.farmerId?._id
                    : item.farmerId;

            if (!farmerId) {
                alert(`Farmer information is missing for ${item.name}.`);
                return;
            }

            if (!farmerOrders[farmerId]) {
                farmerOrders[farmerId] = [];
            }

            farmerOrders[farmerId].push({
                productId: item._id,
                name: item.name,
                price: Number(item.price),
                quantity: item.cartQuantity,
                subtotal: Number(item.price) * item.cartQuantity
            });
        }

        const token = localStorage.getItem('token');

        if (!token) {
            alert('Please log in before placing your order.');
            setCurrentPage('login');
            return;
        }

        setLoading(true);

        try {
            for (const farmerId of Object.keys(farmerOrders)) {
                const response = await fetch(
                    'http://localhost:3000/api/orders',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            farmerId,
                            items: farmerOrders[farmerId],
                            deliveryAddress,
                            phone
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Failed to place order.'
                    );
                }
            }

            alert('Your order has been placed successfully!');

            setCart([]);
            setCurrentPage('buyerDashboard');

        } catch (error) {
            alert(error.message || 'Something went wrong while placing your order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">

            <section className="checkout-header">
                <h1>Checkout</h1>
                <p>Review your order and provide your delivery information.</p>
            </section>

            <div className="checkout-container">

                {cart.length === 0 ? (
                    <div className="checkout-empty">
                        <h2>Your cart is empty</h2>
                        <p>Add some products before proceeding to checkout.</p>

                        <button
                            type="button"
                            onClick={() => setCurrentPage('products')}
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <>
                        <section className="checkout-order-section">
                            <h2>Order Summary</h2>

                            <div className="checkout-items-list">
                                {cart.map((item) => (
                                    <div
                                        className="checkout-item"
                                        key={item._id}
                                    >
                                        <div className="checkout-item-details">
                                            <h3>{item.name}</h3>

                                            <p>
                                                Unit Price: {Number(item.price).toLocaleString()} FCFA
                                            </p>

                                            <p>
                                                Quantity: {item.cartQuantity}
                                            </p>
                                        </div>

                                        <p className="checkout-item-subtotal">
                                            {(
                                                Number(item.price) *
                                                item.cartQuantity
                                            ).toLocaleString()} FCFA
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="checkout-total">
                                <div>
                                    <span>Total Items</span>
                                    <strong>{totalItems}</strong>
                                </div>

                                <div>
                                    <span>Total Amount</span>
                                    <strong>
                                        {totalAmount.toLocaleString()} FCFA
                                    </strong>
                                </div>
                            </div>
                        </section>

                        <section className="checkout-form-section">
                            <h2>Delivery Information</h2>

                            <form onSubmit={handleCheckout}>
                                <div className="checkout-form-group">
                                    <label htmlFor="deliveryAddress">
                                        Delivery Address
                                    </label>

                                    <textarea
                                        id="deliveryAddress"
                                        value={deliveryAddress}
                                        onChange={(e) =>
                                            setDeliveryAddress(e.target.value)
                                        }
                                        placeholder="Enter your complete delivery address"
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div className="checkout-form-group">
                                    <label htmlFor="phone">
                                        Phone Number
                                    </label>

                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="place-order-button"
                                    disabled={loading || cart.length === 0}
                                >
                                    {loading
                                        ? 'Placing Order...'
                                        : 'Place Order'}
                                </button>
                            </form>
                        </section>
                    </>
                )}

                <button
                    type="button"
                    className="back-to-cart-button"
                    onClick={() => setCurrentPage('cart')}
                    disabled={loading}
                >
                    Back to Cart
                </button>

            </div>
        </div>
    );
}

export default Checkout;
