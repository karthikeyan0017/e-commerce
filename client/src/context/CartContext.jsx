import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('auracommerce_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, type: 'percent'|'fixed'|'free_shipping', value }
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('auracommerce_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product === product._id);
      if (existing) {
        const newQty = Math.min(existing.qty + qty, product.countInStock || 99);
        showToast(`Updated quantity of ${product.name} to ${newQty}`, 'info');
        return prevItems.map((item) =>
          item.product === product._id ? { ...item, qty: newQty } : item
        );
      } else {
        showToast(`Added ${product.name} to cart!`, 'success');
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.imageUrl,
            countInStock: product.countInStock,
            category: product.category,
            qty: Math.min(qty, product.countInStock || 99)
          }
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          const maxStock = item.countInStock || 99;
          return { ...item, qty: Math.min(newQty, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
    setPromoCode('');
  };

  // Promo Code Validation
  const applyPromo = (codeToApply) => {
    const cleanCode = (codeToApply || promoCode).trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'ZILO15') {
      setAppliedPromo({ code: 'ZILO15', type: 'percent', value: 15, label: '15% Off Your First Frame Order' });
      showToast('Promo code ZILO15 applied! 15% discount', 'success');
    } else if (cleanCode === 'SAVE10') {
      setAppliedPromo({ code: 'SAVE10', type: 'percent', value: 10, label: '10% Off Entire Order' });
      showToast('Promo code SAVE10 applied! 10% discount', 'success');
    } else if (cleanCode === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', type: 'free_shipping', value: 0, label: 'Free Express Shipping' });
      showToast('Promo code FREESHIP applied! Free Shipping', 'success');
    } else if (cleanCode === 'SUPER25') {
      setAppliedPromo({ code: 'SUPER25', type: 'fixed', value: 25, label: '$25 Special Voucher' });
      showToast('Promo code SUPER25 applied! $25 off', 'success');
    } else {
      showToast('Invalid promo code. Try ZILO15, SAVE10, FREESHIP, or SUPER25', 'error');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    showToast('Promo code removed', 'info');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = (subtotal * appliedPromo.value) / 100;
    } else if (appliedPromo.type === 'fixed') {
      discountAmount = Math.min(subtotal, appliedPromo.value);
    }
  }

  let baseShipping = subtotal > 150 || subtotal === 0 ? 0 : 9.99;
  if (appliedPromo && appliedPromo.type === 'free_shipping') {
    baseShipping = 0;
  }

  const taxAmount = Math.max(0, (subtotal - discountAmount) * 0.08);
  const totalAmount = Math.max(0, subtotal - discountAmount + baseShipping + taxAmount);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        promoCode,
        setPromoCode,
        appliedPromo,
        applyPromo,
        removePromo,
        subtotal: Math.round(subtotal * 100) / 100,
        discountAmount: Math.round(discountAmount * 100) / 100,
        shippingAmount: Math.round(baseShipping * 100) / 100,
        taxAmount: Math.round(taxAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
