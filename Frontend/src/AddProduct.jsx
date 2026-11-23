
import { useState } from 'react';

function AddProduct() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        unit: '',
        quantityAvailable: '',
        region: '',
        town: ''
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const token = localStorage.getItem('token');

        if (!token) {
            setMessage('Please log in before adding a product.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:3000/api/products',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to add product.'
                );
            }

            setMessage('Product added successfully!');

            setFormData({
                name: '',
                category: '',
                description: '',
                price: '',
                unit: '',
                quantityAvailable: '',
                region: '',
                town: ''
            });

        } catch (error) {
            console.error('Error adding product:', error);
            setMessage(error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-page">

            <section className="add-product-header">
                <h1>Add a Farm Product</h1>
                <p>
                    List your fresh produce and connect with buyers across Cameroon.
                </p>
            </section>

            <div className="add-product-container">

                <form
                    className="add-product-form"
                    onSubmit={handleSubmit}
                >

                    <div className="add-product-section">
                        <h2>Product Information</h2>
                        <p>Provide details about the product you want to sell.</p>

                        <div className="add-product-fields">

                            <div className="add-product-field">
                                <label htmlFor="name">Product Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="e.g. Fresh Tomatoes"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="add-product-field">
                                <label htmlFor="category">Category</label>
                                <input
                                    id="category"
                                    type="text"
                                    name="category"
                                    required
                                    placeholder="e.g. Vegetables"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="add-product-field full-width">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    placeholder="Describe your agricultural product..."
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>
                    </div>

                    <div className="add-product-section">
                        <h2>Pricing and Availability</h2>
                        <p>Tell buyers your price and available quantity.</p>

                        <div className="add-product-fields">

                            <div className="add-product-field">
                                <label htmlFor="price">Price (FCFA)</label>
                                <input
                                    id="price"
                                    type="number"
                                    name="price"
                                    min="0"
                                    required
                                    placeholder="Enter price"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="add-product-field">
                                <label htmlFor="unit">Unit</label>
                                <input
                                    id="unit"
                                    type="text"
                                    name="unit"
                                    required
                                    placeholder="e.g. basket, kg"
                                    value={formData.unit}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="add-product-field">
                                <label htmlFor="quantityAvailable">
                                    Available Quantity
                                </label>
                                <input
                                    id="quantityAvailable"
                                    type="number"
                                    name="quantityAvailable"
                                    min="0"
                                    step="1"
                                    required
                                    placeholder="Enter quantity"
                                    value={formData.quantityAvailable}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>
                    </div>

                    <div className="add-product-section">
                        <h2>Product Location</h2>
                        <p>Help buyers know where your products are located.</p>

                        <div className="add-product-fields">

                            <div className="add-product-field">
                                <label htmlFor="region">Region</label>
                                <input
                                    id="region"
                                    type="text"
                                    name="region"
                                    required
                                    placeholder="e.g. Centre"
                                    value={formData.region}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="add-product-field">
                                <label htmlFor="town">Town</label>
                                <input
                                    id="town"
                                    type="text"
                                    name="town"
                                    required
                                    placeholder="e.g. Yaounde"
                                    value={formData.town}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>
                    </div>

                    {message && (
                        <p className="add-product-message" role="status">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="add-product-submit"
                        disabled={loading}
                    >
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default AddProduct;
