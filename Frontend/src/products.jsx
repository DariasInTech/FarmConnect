
import { useState } from 'react';

function Products({
    onHome,
    products,
    setSelectedProduct,
    setCurrentPage,
    cart,
    setCart
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const safeProducts = Array.isArray(products) ? products : [];
    const safeCart = Array.isArray(cart) ? cart : [];

    const filteredProducts = safeProducts.filter((product) => {
        const search = searchTerm.trim().toLowerCase();

        return (
            product.name?.toLowerCase().includes(search) ||
            product.category?.toLowerCase().includes(search) ||
            product.location?.town?.toLowerCase().includes(search) ||
            product.location?.region?.toLowerCase().includes(search)
        );
    });

    const cartItemCount = safeCart.reduce(
        (total, item) => total + (item.cartQuantity || 1),
        0
    );

    const addToCart = (product) => {
        const isAvailable =
            product.availability?.trim().toLowerCase() === 'available';

        if (!isAvailable) return;

        setCart((currentCart) => {
            const existingProduct = currentCart.find(
                (item) => item._id === product._id
            );

            if (existingProduct) {
                return currentCart.map((item) =>
                    item._id === product._id
                        ? {
                            ...item,
                            cartQuantity: (item.cartQuantity || 1) + 1
                        }
                        : item
                );
            }

            return [
                ...currentCart,
                {
                    ...product,
                    cartQuantity: 1
                }
            ];
        });

        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="products-page">
            <nav className="products-nav">
                <h2>FarmConnect</h2>

                <ul>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onHome();
                            }}
                        >
                            Dashboard
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            className="active"
                            onClick={(e) => e.preventDefault()}
                            aria-current="page"
                        >
                            Products
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage('cart');
                            }}
                        >
                            Cart ({cartItemCount})
                        </a>
                    </li>
                </ul>
            </nav>

            <section className="products-header">
                <div>
                    <span className="products-subtitle">
                        FRESH FROM THE FARM
                    </span>

                    <h1>Explore Farm Products</h1>

                    <p>
                        Discover fresh agricultural produce directly from
                        farmers across Cameroon.
                    </p>
                </div>
            </section>

            <section className="products-content">
                <div className="products-toolbar">
                    <div>
                        <h2>Available Products</h2>
                        <p>
                            {filteredProducts.length} product(s) found
                        </p>
                    </div>

                    <div className="search-container">
                        <input
                            type="search"
                            placeholder="Search by product, category or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search products"
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                aria-label="Clear product search"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="products-empty-state">
                        <h3>No products found</h3>

                        <p>
                            {searchTerm
                                ? 'Try another search term.'
                                : 'There are no products available at the moment.'}
                        </p>

                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="product-list">
                        {filteredProducts.map((product) => {
                            const isAvailable =
                                product.availability?.trim().toLowerCase() ===
                                'available';

                            return (
                                <div
                                    className="product-card"
                                    key={product._id}
                                >
                                    <div className="product-card-image">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name || 'Farm product'}
                                            />
                                        ) : (
                                            <div className="product-image-placeholder">
                                                <span>No image available</span>
                                            </div>
                                        )}

                                        <span
                                            className={
                                                isAvailable
                                                    ? 'product-status in-stock'
                                                    : 'product-status out-of-stock'
                                            }
                                        >
                                            {product.availability || 'Unknown'}
                                        </span>
                                    </div>

                                    <div className="product-card-content">
                                        <span className="product-category">
                                            {product.category || 'Uncategorized'}
                                        </span>

                                        <h3>{product.name}</h3>

                                        <p className="product-location">
                                            <strong>Location:</strong>{' '}
                                            {product.location?.town || 'Unknown'},
                                            {' '}
                                            {product.location?.region || 'Unknown'}
                                        </p>

                                        <p className="product-price">
                                            {Number(product.price || 0).toLocaleString(
                                                'en-US'
                                            )} FCFA
                                        </p>

                                        <div className="product-card-actions">
                                            <button
                                                type="button"
                                                className="view-product-btn"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setCurrentPage('details');
                                                }}
                                            >
                                                View Details
                                            </button>

                                            <button
                                                type="button"
                                                className="add-to-cart-btn"
                                                onClick={() => addToCart(product)}
                                                disabled={!isAvailable}
                                            >
                                                {isAvailable
                                                    ? 'Add to Cart'
                                                    : 'Unavailable'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Products;
