import React, { useState, useEffect, useCallback } from "react";
import AssetRow from "./AssetRow";
import { useAuth } from "../contexts/AuthContext";
import { createClient } from "@supabase/supabase-js";
import LoginModal from "./LoginModal";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const initialAssets = [
  { id: 1, ticker: "", avgPrice: "", holdings: "", targetWeight: "" },
];

export default function AssetTable() {
  const [showAddRow, setShowAddRow] = useState(false);
  // Tooltip state for ticker full name
  const [assetTooltip, setAssetTooltip] = useState({});

  // Expose tooltip setter/getter globally for AssetRow
  window.assetTooltip = assetTooltip;
  window.setAssetTooltip = (id, tooltipObj) => {
    setAssetTooltip(prev => {
      if (!tooltipObj) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: tooltipObj };
    });
  };

  const [assets, setAssets] = useState(initialAssets);
  const [cash, setCash] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();

  // Create portfolios table if it doesn't exist
  const ensureTableExists = async () => {
    try {
      // Check if table exists
      const { error: checkError } = await supabase
        .from('portfolios')
        .select('*')
        .limit(1);
      
      // If no error, table exists
      if (!checkError) return true;
      
      console.log('Creating portfolios table...');
      
      // Create table using RPC (Remote Procedure Call)
      const { data, error: createError } = await supabase.rpc('create_portfolios_table');
      
      if (createError) {
        console.error('Error creating table:', createError);
        
        // If RPC is not allowed, try direct SQL (for development)
        if (createError.code === 'PGRST202') {
          console.log('Falling back to direct SQL...');
          const { error: sqlError } = await supabase.rpc('execute_sql', {
            query: `
              create table if not exists public.portfolios (
                user_id uuid references auth.users(id) primary key,
                assets jsonb not null default '[]'::jsonb,
                cash numeric default 0,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null
              );
              
              alter table public.portfolios enable row level security;
              
              create or replace function public.handle_new_portfolio() 
              returns trigger as $$
              begin
                insert into public.portfolios (user_id)
                values (new.id);
                return new;
              end;
              $$ language plpgsql security definer;
              
              create or replace trigger on_auth_user_created
                after insert on auth.users
                for each row execute procedure public.handle_new_portfolio();
              
              create policy "Users can view their own portfolio"
                on public.portfolios for select
                using (auth.uid() = user_id);
                
              create policy "Users can insert their own portfolio"
                on public.portfolios for insert
                with check (auth.uid() = user_id);
                
              create policy "Users can update their own portfolio"
                on public.portfolios for update
                using (auth.uid() = user_id);
            `
          });
          
          if (sqlError) throw sqlError;
          return true;
        }
        
        throw createError;
      }
      
      return true;
    } catch (error) {
      console.error('Error in ensureTableExists:', error);
      return false;
    }
  };

  // Load portfolio when user changes
  useEffect(() => {
    const loadPortfolio = async () => {
      if (!user) {
        setAssets(initialAssets);
        setCash("");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Ensure table exists
        const tableReady = await ensureTableExists();
        if (!tableReady) {
          console.error('Failed to ensure portfolios table exists');
          setAssets(initialAssets);
          setCash("");
          return;
        }

        // Get user's portfolio
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Handle 404 (no portfolio found) as a normal case
        if (error && error.code !== 'PGRST116') {
          console.error('Error loading portfolio:', error);
          throw error;
        }

        if (data) {
          // Initialize with user's data
          const validAssets = Array.isArray(data.assets)
  ? data.assets.filter(a => a && typeof a === 'object')
  : [];
setAssets(validAssets.length > 0 ? validAssets : initialAssets);
          setCash(data.cash || "");
        } else {
          // Create new empty portfolio for the user
          const { error: insertError } = await supabase
            .from('portfolios')
            .insert([{
              user_id: user.id,
              assets: [],
              cash: 0
            }]);
            
          if (insertError) throw insertError;
          
          setAssets(initialAssets);
          setCash("");
        }
      } catch (error) {
        console.error('Error in loadPortfolio:', error);
        // Continue with default state even if there's an error
        setAssets(initialAssets);
        setCash("");
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolio();
  }, [user]);

  const handleSavePortfolio = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      setIsLoading(true);
      
      // Ensure table exists
      const tableReady = await ensureTableExists();
      if (!tableReady) {
        alert('Database is not ready. Please try again in a moment.');
        return;
      }
      
      // Validate all required fields
      const validationErrors = [];
      const validAssets = assets
        .filter(asset => asset.ticker && asset.ticker.trim() !== '')
        .map(asset => {
          const ticker = asset.ticker.trim().toUpperCase();
          const avgPrice = asset.avgPrice ? parseFloat(asset.avgPrice) : null;
          const holdings = asset.holdings ? parseFloat(asset.holdings) : null;
          const targetWeight = asset.targetWeight ? parseFloat(asset.targetWeight) : null;
          
          // Check for missing required fields
          if (isNaN(avgPrice) || avgPrice < 0) {
            validationErrors.push(`Please enter a valid average price for ${ticker}`);
          }
          if (isNaN(holdings) || holdings < 0) {
            validationErrors.push(`Please enter valid holdings for ${ticker}`);
          }
          if (isNaN(targetWeight) || targetWeight < 0) {
            validationErrors.push(`Please enter a valid target weight for ${ticker}`);
          }
          
          return {
            ...asset,
            ticker,
            avgPrice: avgPrice || 0,
            holdings: holdings || 0,
            targetWeight: targetWeight || 0
          };
        });

      if (validAssets.length === 0) {
        alert('Please add at least one asset with a valid ticker.');
        return;
      }
      
      // Show validation errors if any
      if (validationErrors.length > 0) {
        alert(validationErrors.join('\n'));
        return;
      }

      const portfolioData = { 
        user_id: user.id, 
        assets: validAssets,
        cash: parseFloat(cash) || 0,
        updated_at: new Date().toISOString()
      };

      // First try to update, if that fails with 404, try insert
      const { error: updateError } = await supabase
        .from('portfolios')
        .update(portfolioData)
        .eq('user_id', user.id);

      if (updateError) {
        if (updateError.code === 'PGRST116') { // Not found
          // Insert new portfolio
          const { error: insertError } = await supabase
            .from('portfolios')
            .insert([portfolioData]);
            
          if (insertError) throw insertError;
        } else {
          throw updateError;
        }
      }
      
      alert('Portfolio saved successfully!');
    } catch (error) {
      console.error('Error in handleSavePortfolio:', error);
      alert('Failed to save portfolio: ' + (error.message || 'Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAsset = () => {
    setAssets([
      ...assets,
      { id: Date.now(), ticker: "", avgPrice: "", holdings: "", targetWeight: "" },
    ]);
  };

  const handleRemoveAsset = (id) => {
    if (assets.length > 1) {
      setAssets(assets.filter((asset) => asset.id !== id));
    }
  };

  const handleAssetChange = (id, field, value) => {
    setAssets(
      assets.map((asset) =>
        asset.id === id ? { ...asset, [field]: value } : asset
      )
    );
  };
  return (
    <div className="asset-table-outer" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="asset-table-container" style={{ display: 'inline-block', width: 'auto', maxWidth: 'none', overflowX: 'visible' }}>
      <style>{`
        .asset-table {
          table-layout: auto !important;
          width: auto !important;
          border-collapse: collapse;
        }
        .asset-table th, .asset-table td {
          white-space: nowrap;
        }
        .asset-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        .save-portfolio-btn {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

  `}</style>
  <div className="cash-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="cash" style={{ marginRight: '0.5rem' }}>Cash ($):</label>
      <input
        id="cash"
        type="number"
        min="0"
        step="0.01"
        value={cash}
        onChange={(e) => setCash(e.target.value)}
        placeholder="0.00"
        style={{
          padding: '0.5rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          width: '150px'
        }}
        disabled={isLoading}
      />
    </div>
        <button 
          className="save-portfolio-btn" 
          onClick={handleSavePortfolio}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#6c757d' : '#28a745',
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            padding: '0.5rem 1.2rem',
            borderRadius: '4px',
            color: 'white',
            fontWeight: 600,
            border: 'none',
            fontSize: '1rem'
          }}
        >
          {isLoading ? 'Saving...' : 'Save Portfolio'}
        </button>
      </div>
      <table className="asset-table" style={{ tableLayout: 'auto', width: 'auto' }}>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Name</th>
            <th>Current Price</th>
            <th>Avg Price</th>
            <th>Holdings</th>
            <th>현재 비율 (%)</th>
            <th>Target %</th>
            <th>Buy/Sell</th>
            <th></th>
          </tr>
        </thead>
        <tbody
          onMouseEnter={() => setShowAddRow(true)}
          onMouseLeave={() => setShowAddRow(false)}
        >
          {(() => {
            // Calculate total portfolio value
            const assetValues = assets.map(a => {
              if (!a) return 0;
              const price = a.currentPrice !== undefined ? parseFloat(a.currentPrice) : (a.price !== undefined ? parseFloat(a.price) : NaN);
              const holding = parseFloat(a.holdings);
              return (!isNaN(price) && !isNaN(holding)) ? price * holding : 0;
            });
            const totalAssetValue = assetValues.reduce((acc, v) => acc + v, 0);
            const cashValue = parseFloat(cash) || 0;
            const totalPortfolioValue = cashValue + totalAssetValue;
            const rows = assets.map((asset, idx) => {
              if (!asset) return null;
              const price = asset.currentPrice !== undefined ? parseFloat(asset.currentPrice) : (asset.price !== undefined ? parseFloat(asset.price) : NaN);
              const holding = parseFloat(asset.holdings);
              const value = (!isNaN(price) && !isNaN(holding)) ? price * holding : 0;
              const weight = totalPortfolioValue > 0 ? (value / totalPortfolioValue) * 100 : 0;
              return (
                <AssetRow
                  key={asset.id}
                  asset={asset}
                  onChange={handleAssetChange}
                  onRemove={handleRemoveAsset}
                  assetWeight={weight}
                />
              );
            });
            if (assets.length === 0) {
              rows.push(
                <tr key="add-row" className="add-row" onClick={handleAddAsset}
                  style={{ cursor: 'pointer', background: '#232323', color: '#ffc107', fontWeight: 600 }}>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '0.75rem 0' }}>
                    + 자산 추가
                  </td>
                </tr>
              );
            } else if (showAddRow) {
              rows.push(
                <tr key="add-row" className="add-row" onClick={handleAddAsset}
                  style={{ cursor: 'pointer', background: '#232323', color: '#ffc107', fontWeight: 600 }}>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '0.75rem 0' }}>
                    + 자산 추가
                  </td>
                </tr>
              );
            }
            return rows;
          })()}
        </tbody>
      </table>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      </div>
    </div>
  );
}
