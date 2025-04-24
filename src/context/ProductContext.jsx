import React, { createContext, useContext, useEffect, useState } from 'react';
import { productAPI } from '../services/api';
import { toast } from 'sonner';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data synchronization
  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await productAPI.fetchAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err);
      toast.error('Failed to sync inventory');
    } finally {
      setIsLoading(false);
    }
  };

  // Optimistic delete
  const deleteProduct = async (id) => {
    const previousProducts = [...products];
    
    try {
      setProducts(prev => prev.filter(p => p.id !== id));
      await productAPI.delete(id);
      toast.success('Product nuked successfully');
    } catch (err) {
      setProducts(previousProducts);
      toast.error('Failed to delete - Rolling back');
    }
  };

  // Real-time sync every 30s
  useEffect(() => {
    refreshProducts();
    const interval = setInterval(refreshProducts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        error,
        refreshProducts,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// Hook with error boundary
export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
}