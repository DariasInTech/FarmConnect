
import './App.css';
import { useState, useEffect } from 'react';
import Products from './products';
import AddProduct from './AddProduct';
import Register from './Register';
import Login from './Login';
import MyProducts from './MyProducts';
import Cart from './Cart';
import Checkout from './Checkout';
import BuyerOrders from './BuyerOrders';
import FarmerOrders from './FarmerOrders';

function App() {
    const [loggedInUser, setLoggedInUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );

    const [currentPage, setCurrentPage] = useState(
        loggedInUser
            ? loggedInUser.role === 'Farmer'
                ? 'farmerDashboard'
                : 'buyerDashboard'
            : 'home'
    );

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/api/products')
            .then((response) => response.json())
            .then((data) => {
                console.log('Products received:', data);
                setProducts(data);
            })
            .catch((error) =>
                console.error('Error fetching products:', error)
            );
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoggedInUser(null);
        setCart([]);
        setCurrentPage('home');
    };

    const goToDashboard = () => {
        setCurrentPage(
            loggedInUser
                ? loggedInUser.role === 'Farmer'
                    ? 'farmerDashboard'
                    : 'buyerDashboard'
                : 'home'
        );
    };

    const categories = [
        { name: 'Vegetables', icon: '🥬', description: 'Fresh farm vegetables' },
        { name: 'Fruits', icon: '🍎', description: 'Naturally fresh fruits' },
        { name: 'Grains', icon: '🌾', description: 'Quality grains and cereals' },
        { name: 'Tubers & Roots', icon: '🥔', description: 'Cassava, potatoes and more' },
        { name: 'Livestock', icon: '🐄', description: 'Farm-raised livestock' },
        { name: 'Cash Crops', icon: '🌱', description: 'Agricultural cash crops' }
    ];

    return (
        <div className="farmconnect-app">

            {currentPage === 'register' ? (
                <Register
                    onLogin={() => setCurrentPage('login')}
                />

            ) : currentPage === 'login' ? (
                <Login
                    onHome={() => setCurrentPage('home')}
                    onRegister={() => setCurrentPage('register')}
                    onLoginSuccess={(user) => {
                        setLoggedInUser(user);

                        if (user.role === 'Farmer') {
                            setCurrentPage('farmerDashboard');
                        } else {
                            setCurrentPage('buyerDashboard');
                        }
                    }}
                />

            ) : currentPage === 'farmerDashboard' ? (
                loggedInUser?.role === 'Farmer' ? (
                    <div className="dashboard-page farmer-dashboard">
                        <nav>
                            <h2>FarmConnect</h2>
                            <button onClick={handleLogout}>Logout</button>
                        </nav>

                        <section>
                            <h1>Farmer Dashboard</h1>
                            <h3>Welcome, {loggedInUser.name}!</h3>
                            <p>
                                Manage your farm products and buyer orders.
                            </p>

                            <button onClick={() => setCurrentPage('addProduct')}>
                                Add New Product
                            </button>

                            <button onClick={() => setCurrentPage('myProducts')}>
                                My Products
                            </button>

                            <button onClick={() => setCurrentPage('farmerOrders')}>
                                Customer Orders
                            </button>

                            <button onClick={() => setCurrentPage('products')}>
                                Browse Products
                            </button>
                        </section>
                    </div>
                ) : (
                    <h2>Access denied. Please log in as a farmer.</h2>
                )

            ) : currentPage === 'farmerOrders' ? (
                loggedInUser?.role === 'Farmer' ? (
                    <FarmerOrders setCurrentPage={setCurrentPage} />
                ) : (
                    <h2>Access denied. Please log in as a farmer.</h2>
                )

            ) : currentPage === 'buyerDashboard' ? (
                loggedInUser?.role === 'buyer' ? (
                    <div className="dashboard-page buyer-dashboard">
                        <nav>
                            <h2>FarmConnect</h2>
                            <button onClick={handleLogout}>Logout</button>
                        </nav>

                        <section>
                            <h1>Buyer Dashboard</h1>
                            <h3>Welcome, {loggedInUser.name}!</h3>
                            <p>
                                Discover fresh agricultural products directly
                                from farmers.
                            </p>

                            <button onClick={() => setCurrentPage('products')}>
                                Browse Farm Products
                            </button>

                            <button onClick={() => setCurrentPage('cart')}>
                                My Cart ({cart.length})
                            </button>

                            <button onClick={() => setCurrentPage('buyerOrders')}>
                                My Orders
                            </button>
                        </section>
                    </div>
                ) : (
                    <h2>Access denied. Please log in as a buyer.</h2>
                )

            ) : currentPage === 'buyerOrders' ? (
                loggedInUser?.role === 'buyer' ? (
                    <BuyerOrders setCurrentPage={setCurrentPage} />
                ) : (
                    <h2>Access denied. Please log in as a buyer.</h2>
                )

            ) : currentPage === 'details' ? (
                <div className="product-details-page">
                    <div className="product-details-container">

                        <div className="product-details-image">
                            {selectedProduct?.image ? (
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                />
                            ) : (
                                <div className="product-details-placeholder">
                                    Product Image
                                </div>
                            )}
                        </div>

                        <div className="product-details-content">
                            <p className="product-details-category">
                                {selectedProduct?.category}
                            </p>

                            <h1>{selectedProduct?.name}</h1>

                            <p className="product-details-description">
                                {selectedProduct?.description || 'No description provided.'}
                            </p>

                            <h2 className="product-details-price">
                                {Number(selectedProduct?.price || 0).toLocaleString()} FCFA
                            </h2>

                            <div className="product-details-info">
                                <p>
                                    <strong>Unit:</strong> {selectedProduct?.unit}
                                </p>

                                <p>
                                    <strong>Available Quantity:</strong>{' '}
                                    {selectedProduct?.quantityAvailable}
                                </p>

                                <p>
                                    <strong>Location:</strong>{' '}
                                    {selectedProduct?.location?.town},{' '}
                                    {selectedProduct?.location?.region}
                                </p>
                            </div>

                            <button onClick={() => setCurrentPage('products')}>
                                Back to Products
                            </button>
                        </div>
                    </div>
                </div>

            ) : currentPage === 'myProducts' ? (
                loggedInUser?.role === 'Farmer' ? (
                    <div>
                        <button onClick={() => setCurrentPage('farmerDashboard')}>
                            Back to Dashboard
                        </button>
                        <MyProducts />
                    </div>
                ) : (
                    <h2>Access denied.</h2>
                )

            ) : currentPage === 'addProduct' ? (
                loggedInUser?.role === 'Farmer' ? (
                    <div>
                        <button onClick={() => setCurrentPage('farmerDashboard')}>
                            Back to Dashboard
                        </button>
                        <AddProduct />
                    </div>
                ) : (
                    <h2>Access denied. Only farmers can add products.</h2>
                )

            ) : currentPage === 'cart' ? (
                loggedInUser?.role === 'buyer' ? (
                    <Cart
                        cart={cart}
                        setCart={setCart}
                        setCurrentPage={setCurrentPage}
                    />
                ) : (
                    <h2>Access denied. Please log in as a buyer.</h2>
                )

            ) : currentPage === 'checkout' ? (
                loggedInUser?.role === 'buyer' ? (
                    <Checkout
                        cart={cart}
                        setCart={setCart}
                        setCurrentPage={setCurrentPage}
                    />
                ) : (
                    <h2>Access denied. Please log in as a buyer.</h2>
                )

            ) : currentPage === 'products' ? (
                <Products
                    cart={cart}
                    setCart={setCart}
                    onHome={goToDashboard}
                    products={products}
                    setSelectedProduct={setSelectedProduct}
                    setCurrentPage={setCurrentPage}
                />

            ) : (
                <>
                    <nav className="home-nav">
                        <div className="home-nav-brand">
                            <h2>FarmConnect</h2>
                            <span>Freshness from the source</span>
                        </div>

                        <ul>
                            <li>
                                <a
                                    href="#home"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage('home');
                                    }}
                                >
                                    Home
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#products"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage('products');
                                    }}
                                >
                                    Products
                                </a>
                            </li>

                            {!loggedInUser ? (
                                <>
                                    <li>
                                        <a
                                            href="#login"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage('login');
                                            }}
                                        >
                                            Login
                                        </a>
                                    </li>

                                    <li>
                                        <button
                                            className="home-register-btn"
                                            onClick={() => setCurrentPage('register')}
                                        >
                                            Get Started
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <a
                                            href="#dashboard"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                goToDashboard();
                                            }}
                                        >
                                            Dashboard
                                        </a>
                                    </li>

                                    <li>
                                        <button
                                            className="home-register-btn"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>

                    <main className="home-page">

                        <section className="home-hero" id="home">
                            <div className="home-hero-content">
                                <span className="home-hero-label">
                                    FARM FRESH. LOCALLY SOURCED.
                                </span>

                                <h1>
                                    Fresh Farm Produce,
                                    <span> Direct from Farmers</span>
                                </h1>

                                <p>
                                    Buy fresh agricultural products directly
                                    from farmers across Cameroon. Discover
                                    quality produce, support local farmers,
                                    and enjoy freshness from the source.
                                </p>

                                <div className="home-hero-actions">
                                    <button
                                        className="hero-primary-btn"
                                        onClick={() => setCurrentPage('products')}
                                    >
                                        Explore Products
                                    </button>

                                    {!loggedInUser && (
                                        <button
                                            className="hero-secondary-btn"
                                            onClick={() => setCurrentPage('register')}
                                        >
                                            Join FarmConnect
                                        </button>
                                    )}
                                </div>

                                <div className="home-hero-note">
                                    Connecting local farmers with buyers
                                    across Cameroon.
                                </div>
                            </div>

                            <div className="home-hero-visual">
                                <div className="home-hero-image-placeholder">
                                    <span>🌾</span>
                                    <p>Fresh from the farm</p>
                                </div>
                            </div>
                        </section>

                        <section className="home-benefits">
                            <div>
                                <span>🌱</span>
                                <h3>Fresh Produce</h3>
                                <p>Discover agricultural products from local farms.</p>
                            </div>

                            <div>
                                <span>🤝</span>
                                <h3>Direct Connection</h3>
                                <p>Connect buyers directly with farmers.</p>
                            </div>

                            <div>
                                <span>📍</span>
                                <h3>Local Products</h3>
                                <p>Explore produce from different regions of Cameroon.</p>
                            </div>
                        </section>

                        <section className="home-categories categories">
                            <div className="home-section-heading">
                                <span>DISCOVER MORE</span>
                                <h2>Explore Product Categories</h2>
                                <p>
                                    Find the agricultural products you need.
                                </p>
                            </div>

                            <div className="home-category-grid">
                                {categories.map((category) => (
                                    <button
                                        className="home-category-card"
                                        key={category.name}
                                        onClick={() => setCurrentPage('products')}
                                    >
                                        <span className="category-icon">
                                            {category.icon}
                                        </span>

                                        <h3>{category.name}</h3>
                                        <p>{category.description}</p>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="home-featured-products products" id="products">
                            <div className="home-section-heading">
                                <span>FROM OUR FARMERS</span>
                                <h2>Featured Products</h2>
                                <p>
                                    Explore some of the products available
                                    on FarmConnect.
                                </p>
                            </div>

                            {products.length === 0 ? (
                                <div className="home-no-products">
                                    <p>
                                        No products are available right now.
                                        Please check again later.
                                    </p>
                                </div>
                            ) : (
                                <div className="product-list">
                                    {products.slice(0, 6).map((product) => (
                                        <div
                                            className="product-card"
                                            key={product._id}
                                        >
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                />
                                            ) : (
                                                <div className="product-image-placeholder">
                                                    No image available
                                                </div>
                                            )}

                                            <div className="home-product-content">
                                                <h3>{product.name}</h3>

                                                <p>
                                                    Category: {product.category}
                                                </p>

                                                <p className="home-product-price">
                                                    {Number(product.price || 0).toLocaleString()} FCFA
                                                </p>

                                                <p>
                                                    Location: {product.location?.town || 'Unknown'},
                                                    {' '}{product.location?.region || 'Unknown'}
                                                </p>

                                                <p>
                                                    Availability:
                                                    <span className={
                                                        product.availability?.trim().toLowerCase() === 'available'
                                                            ? 'in-stock'
                                                            : 'out-of-stock'
                                                    }>
                                                        {' '}{product.availability || 'Unknown'}
                                                    </span>
                                                </p>

                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setCurrentPage('details');
                                                    }}
                                                >
                                                    View Product
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {products.length > 0 && (
                                <div className="home-view-all">
                                    <button onClick={() => setCurrentPage('products')}>
                                        View All Products
                                    </button>
                                </div>
                            )}
                        </section>

                        <section className="home-call-to-action">
                            <h2>Be Part of the FarmConnect Community</h2>
                            <p>
                                Whether you are a farmer or a buyer,
                                FarmConnect helps you connect.
                            </p>

                            <button
                                onClick={() => setCurrentPage(
                                    loggedInUser ? 'products' : 'register'
                                )}
                            >
                                {loggedInUser ? 'Explore Products' : 'Create Your Account'}
                            </button>
                        </section>

                    </main>

                    <footer className="home-footer">
                        <h2>FarmConnect</h2>
                        <p>
                            Connecting farmers and buyers through fresh
                            agricultural produce.
                        </p>
                        <span>© {new Date().getFullYear()} FarmConnect. All rights reserved.</span>
                    </footer>
                </>
            )}
        </div>
    );
}

export default App;
