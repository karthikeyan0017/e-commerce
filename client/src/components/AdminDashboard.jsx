import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Truck,
  RotateCcw,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminDashboard = () => {
  const { token, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders'
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Audio',
    brand: 'AuraSound',
    countInStock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    description: '',
    isFeatured: false,
    isNewArrival: false
  });

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=50');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?limit=50', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchProducts(), fetchOrders()]);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin && token) {
      refreshAll();
    }
  }, [isAdmin, token]);

  // Open modal to add or edit product
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductFormData({
        name: prod.name,
        price: prod.price,
        originalPrice: prod.originalPrice || prod.price,
        category: prod.category,
        brand: prod.brand || 'AuraTech',
        countInStock: prod.countInStock,
        imageUrl: prod.imageUrl,
        description: prod.description,
        isFeatured: Boolean(prod.isFeatured),
        isNewArrival: Boolean(prod.isNewArrival)
      });
    } else {
      setEditingProduct(null);
      setProductFormData({
        name: '',
        price: '',
        originalPrice: '',
        category: 'Audio',
        brand: 'AuraTech',
        countInStock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
        description: 'Engineered for exceptional precision, high fidelity, and durability.',
        isFeatured: false,
        isNewArrival: true
      });
    }
    setProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productFormData.name || !productFormData.price || !productFormData.imageUrl) {
      showToast('Please enter name, price, and image URL', 'error');
      return;
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productFormData)
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingProduct ? 'Product updated successfully!' : 'New product created!', 'success');
        setProductModalOpen(false);
        fetchProducts();
        fetchStats();
      } else {
        showToast(data.message || 'Error saving product', 'error');
      }
    } catch (err) {
      showToast('Network error saving product', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Product deleted successfully', 'info');
        fetchProducts();
        fetchStats();
      } else {
        showToast(data.message || 'Error deleting product', 'error');
      }
    } catch (err) {
      showToast('Network error deleting product', 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to: ${newStatus}`, 'success');
        fetchOrders();
        fetchStats();
      } else {
        showToast(data.message || 'Error updating order status', 'error');
      }
    } catch (err) {
      showToast('Network error updating status', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          You must be signed in with an administrator account to view the Admin Control Panel.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0', minHeight: '85vh' }}>
      <div className="container">
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
              <ShieldCheck size={16} />
              Management Console
            </div>
            <h2 style={{ fontSize: '2.4rem' }}>Admin Dashboard</h2>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => handleOpenProductModal()}
              className="btn btn-primary btn-sm"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
            <button onClick={refreshAll} className="btn btn-secondary btn-sm">
              <RotateCcw size={15} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          {[
            { id: 'overview', label: 'Overview & Metrics' },
            { id: 'products', label: `Products Catalog (${products.length})` },
            { id: 'orders', label: `Customer Orders (${orders.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: activeTab === tab.id ? 'var(--accent-light)' : 'transparent',
                transition: 'var(--transition)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div>
            {/* Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL REVENUE</span>
                  <DollarSign size={20} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0.00'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.25rem' }}>
                  ✓ Direct from completed orders
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL ORDERS</span>
                  <ShoppingBag size={20} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  {stats?.totalOrders || orders.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Across all delivery stages
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b5cf6', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>CATALOG ITEMS</span>
                  <Package size={20} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  {stats?.totalProducts || products.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Active inventory listings
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ec4899', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>REGISTERED USERS</span>
                  <Users size={20} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  {stats?.totalUsers || 2}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Active customer accounts
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>LOW STOCK ALERTS</span>
                  <AlertTriangle size={20} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#d97706' }}>
                  {stats?.lowStockCount || 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#d97706', marginTop: '0.25rem' }}>
                  Requires inventory replenishment
                </div>
              </div>
            </div>

            {/* Low Stock Items Showcase */}
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706' }}>
                  <AlertTriangle size={18} />
                  Items Requiring Restock (≤ 5 in stock)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {stats.lowStockProducts.map((p) => (
                    <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)' }}>
                      <img src={p.imageUrl} alt="" style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 700 }}>
                          Only {p.countInStock} remaining!
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenProductModal(products.find((prod) => prod._id === p._id))}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Restock
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div>
            <div className="table-container glass-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock Count</th>
                    <th>Rating</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={p.imageUrl} alt="" style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-new">{p.category}</span>
                      </td>
                      <td style={{ fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                      <td>
                        {p.countInStock <= 5 ? (
                          <span style={{ color: '#d97706', fontWeight: 700 }}>{p.countInStock} (Low)</span>
                        ) : (
                          <span style={{ color: '#10b981', fontWeight: 600 }}>{p.countInStock} in stock</span>
                        )}
                      </td>
                      <td>★ {p.rating?.toFixed(1) || '4.8'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenProductModal(p)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id, p.name)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#ef4444' }}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div>
            <div className="table-container glass-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status & Tracking Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord._id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)' }}>
                        {ord.orderNumber}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{ord.shippingAddress.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.shippingAddress.email}</div>
                      </td>
                      <td>
                        {ord.orderItems?.length || 0} items
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {ord.orderItems?.[0]?.name?.substring(0, 20)}...
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>${ord.totalPrice?.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${ord.isPaid ? 'badge-success' : 'badge-stock'}`}>
                          {ord.paymentMethod} {ord.isPaid ? '✓ Paid' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          style={{
                            width: 'auto',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Create/Edit Modal */}
      {productModalOpen && (
        <div className="modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Product Title *</label>
                  <input
                    type="text"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productFormData.originalPrice}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Category *</label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                  >
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Computing">Computing</option>
                    <option value="Smart Home">Smart Home</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Eyewear">Eyewear</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Stock Inventory *</label>
                  <input
                    type="number"
                    value={productFormData.countInStock}
                    onChange={(e) => setProductFormData({ ...productFormData, countInStock: Number(e.target.value) })}
                    required
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Image URL *</label>
                  <input
                    type="url"
                    value={productFormData.imageUrl}
                    onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
                    required
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Description</label>
                  <textarea
                    rows={3}
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', gridColumn: 'span 2' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productFormData.isFeatured}
                      onChange={(e) => setProductFormData({ ...productFormData, isFeatured: e.target.checked })}
                      style={{ width: 'auto' }}
                    />
                    Featured on Home
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productFormData.isNewArrival}
                      onChange={(e) => setProductFormData({ ...productFormData, isNewArrival: e.target.checked })}
                      style={{ width: 'auto' }}
                    />
                    Mark as New Arrival
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setProductModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
