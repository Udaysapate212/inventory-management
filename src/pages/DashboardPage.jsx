import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductTable from '../components/Dashboard/ProductTable';
import Filters from '../components/Dashboard/Filters';
import SearchBar from '../components/SearchBar';
import ExportButton from '../components/ExportButton';
import { ExpiryTimeline } from '../components/ExpiryChart'
import { Skeleton } from '../components/ui/skeleton'
import { parseISO, differenceInDays } from 'date-fns';

export default function DashboardPage() {
  const { products, isLoading, error, refreshProducts } = useProducts();
  const [searchFilter, setSearchFilter] = useState(() => () => true);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Combine search and expiry filters
  useEffect(() => {
    const filtered = products.filter(p => 
      searchFilter.test(p.name) && 
      differenceInDays(parseISO(p.expDate), new Date()) > -30
    );
    setFilteredProducts(filtered);
  }, [products, searchFilter]);

  if (error) {
    return (
      <div className="alert-error">
        <h2>DEFCON 1 - System Failure</h2>
        <button onClick={refreshProducts} className="btn-retry">
          Launch Countermeasures
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Command Center Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <SearchBar onSearch={(regex) => setSearchFilter(regex)} />
        <div className="flex gap-4">
          <ExportButton />
          <button
            onClick={refreshProducts}
            disabled={isLoading}
            className="btn flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Syncing...
              </>
            ) : (
              'Refresh Data'
            )}
          </button>
        </div>
      </div>

      {/* Strategic Overview */}
      <ExpiryTimeline products={filteredProducts} />

      {/* Threat Detection Filters */}
      <Filters />

      {/* Main Intelligence Grid */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-slate-800 rounded-lg" />
          ))}
        </div>
      ) : (
        <ProductTable products={filteredProducts} />
      )}

      {/* Covert Empty State */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-slate-800 rounded-lg">
          <p className="text-slate-400">No targets match current parameters</p>
        </div>
      )}
    </div>
  );
}