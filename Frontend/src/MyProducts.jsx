
import { useEffect, useState } from 'react';

function MyProducts() {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('Loading your products...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/products/my-products', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Failed to fetch products'
                    );
                }

                setProducts(data);
                setMessage('');
            })
            .catch((error) => {
                setMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="my-products-page">

            <section className="my-products-header">
                <h1>My Products</h1>
                <p>
                    Manage and view the agricultural products you have listed.
                </p>
            </section>

            <div className="my-products-container">

                <div className="my-products-heading">
                    <div>
                        <h2>Your Listings</h2>
                        <p>Products you have added to FarmConnect.</p>
                    </div>

                    {!loading && !message && (
                        <span className="product-count">
                            {products.length} {products.length === 1 ? 'Product' : 'Products'}
                        </span>
                    )}
                </div>

                {loading ? (
                    <p className="my-products-message">
                        Loading your products...
                    </p>
                ) : message ? (
                    <p className="my-products-message error-message">
                        {message}
                    </p>
                ) : products.length === 0 ? (
                    <div className="my-products-empty">
                        <h3>No Products Yet</h3>
                        <p>
                            You have not added any products. Start listing
                            your agricultural products to reach buyers.
                        </p>
                    </div>
                ) : (
                    <div className="my-products-grid">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="my-product-card"
                            >
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="my-product-image"
                                    />
                                ) : (
                                    <div className="my-product-placeholder">
                                        Product Image
                                    </div>
                                )}

                                <div className="my-product-content">
                                    <h3>{product.name}</h3>

                                    <p>
                                        <strong>Category:</strong>{' '}
                                        {product.category}
                                    </p>

                                    <p className="my-product-price">
                                        {Number(product.price).toLocaleString()} FCFA
                                    </p>

                                    <p>
                                        <strong>Available Quantity:</strong>{' '}
                                        {product.quantityAvailable}
                                    </p>

                                    <p>
                                        <strong>Location:</strong>{' '}
                                        {product.location?.town || 'Not specified'}
                                        {product.location?.region
                                            ? `, ${product.location.region}`
                                            : ''}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default MyProducts;
