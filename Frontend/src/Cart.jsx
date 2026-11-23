
function Cart({ cart, setCart, setCurrentPage }) {
    const safeCart = Array.isArray(cart) ? cart : [];

    const updateQuantity = (productId, change) => {
        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item._id === productId
                        ? {
                            ...item,
                            cartQuantity: Math.max(
                                0,
                                (Number(item.cartQuantity) || 1) + change
                            )
                        }
                        : item
                )
                .filter((item) => item.cartQuantity > 0)
        );
    };

    const removeFromCart = (productId) => {
        setCart((currentCart) =>
            currentCart.filter((item) => item._id !== productId)
        );
    };

    const totalAmount = safeCart.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) * (Number(item.cartQuantity) || 1),
        0
    );

    const totalItems = safeCart.reduce(
        (total, item) => total + (Number(item.cartQuantity) || 1),
        0
    );

    return (
        <div className="products-page cart-page">
            <nav className="products-nav">
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
                            Continue Shopping
                        </a>
                    </li>
                </ul>
            </nav>

            <section className="products-header">
                <h1>My Shopping Cart</h1>
                <p>
                    Review your selected farm products before checkout.
                </p>
            </section>

            {safeCart.length === 0 ? (
                <div className="cart-empty">
                    <div className="cart-empty-icon">🛒</div>

                    <h2>Your cart is empty</h2>

                    <p>
                        You haven't added any farm products yet.
                        Explore our marketplace to find fresh produce.
                    </p>

                    <button
                        type="button"
                        onClick={() => setCurrentPage('products')}
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="cart-container">
                    <div className="cart-heading">
                        <h2>Your Selected Products</h2>
                        <p>{totalItems} item(s) in your cart</p>
                    </div>

                    <div className="cart-items-list">
                        {safeCart.map((item) => {
                            const quantity =
                                Number(item.cartQuantity) || 1;

                            const subtotal =
                                Number(item.price || 0) * quantity;

                            return (
                                <div
                                    className="cart-item"
                                    key={item._id}
                                >
                                    <div className="cart-item-details">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name || 'Farm product'}
                                                className="cart-item-image"
                                            />
                                        ) : (
                                            <div className="cart-item-placeholder">
                                                Farm Product
                                            </div>
                                        )}

                                        <div>
                                            <h3>{item.name}</h3>

                                            <p>
                                                Price:{' '}
                                                {Number(item.price || 0).toLocaleString('en-US')}{' '}
                                                FCFA
                                            </p>

                                            <p className="cart-subtotal">
                                                Subtotal:{' '}
                                                {subtotal.toLocaleString('en-US')}{' '}
                                                FCFA
                                            </p>
                                        </div>
                                    </div>

                                    <div className="cart-quantity">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(item._id, -1)
                                            }
                                            aria-label={`Decrease ${item.name} quantity`}
                                        >
                                            −
                                        </button>

                                        <span>{quantity}</span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(item._id, 1)
                                            }
                                            aria-label={`Increase ${item.name} quantity`}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        className="remove-cart-item"
                                        onClick={() =>
                                            removeFromCart(item._id)
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>

                        <div className="cart-summary-row">
                            <span>Total Items:</span>
                            <strong>{totalItems}</strong>
                        </div>

                        <div className="cart-summary-row">
                            <span>Total Amount:</span>
                            <strong>
                                {totalAmount.toLocaleString('en-US')} FCFA
                            </strong>
                        </div>

                        <button
                            type="button"
                            onClick={() => setCurrentPage('checkout')}
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            type="button"
                            className="continue-shopping-button"
                            onClick={() => setCurrentPage('products')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
