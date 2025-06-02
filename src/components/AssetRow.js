import React, { useState, useEffect } from "react";

export default function AssetRow({ asset, onChange, onRemove, assetWeight }) {
  const [tooltipDirection, setTooltipDirection] = useState('down'); // 'down' or 'up'
  const [fullName, setFullName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch full name and price whenever ticker changes (with debounce)
  useEffect(() => {
    if (!asset.ticker) {
      setFullName("");
      setPrice("");
      setError("");
      setLoading(false);
      return;
    }
    let ignore = false;
    setLoading(true);
    setError("");
    setFullName("");
    setPrice("");
    const timeout = setTimeout(() => {
      fetch(`http://localhost:8000/api/ticker-info?ticker=${asset.ticker}`)
        .then(res => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then(data => {
          if (!ignore) {
            setFullName(data.name);
            setPrice(data.price);
            setLoading(false);
            setError("");
          }
        })
        .catch(() => {
          if (!ignore) {
            setFullName("");
            setPrice("");
            setError("Not found");
            setLoading(false);
          }
        });
    }, 400); // debounce
    return () => {
      ignore = true;
      clearTimeout(timeout);
    };
  }, [asset.ticker]);



  return (
    <tr className="asset-row">
      <td style={{ whiteSpace: 'nowrap', minWidth: 'fit-content', width: '1%', padding: 0 }}>
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <input
            type="text"
            value={asset.ticker}
            onChange={(e) => onChange(asset.id, "ticker", e.target.value)}
            placeholder="Ticker"
            style={{ width: '100%', minWidth: 'fit-content', whiteSpace: 'nowrap', boxSizing: 'border-box' }}
          />
        </div>
      </td>
      <td>
        { !asset.ticker ? '--' : loading ? 'Loading...' : error ? 'Not found' : (fullName || '--') }
      </td>
      <td>
        <input
          type="text"
          value={
            !asset.ticker ? '--' : loading ? 'Loading...' : error ? 'Not found' : (price !== '' && price != null ? price : '--')
          }
          readOnly
          tabIndex={-1}
          className="current-price-input"
          style={{ textAlign: 'center', color: '#7ED957', background: '#191717', border: 'none', fontWeight: 700 }}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          value={asset.avgPrice}
          onChange={(e) => onChange(asset.id, "avgPrice", e.target.value)}
          placeholder="$0.00"
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          value={asset.holdings}
          onChange={(e) => onChange(asset.id, "holdings", e.target.value)}
          placeholder="0"
        />
      </td>
      <td>
        {Number.isFinite(assetWeight) ? assetWeight.toFixed(2) : '--'}
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="100"
          value={asset.targetWeight}
          onChange={(e) => onChange(asset.id, "targetWeight", e.target.value)}
          placeholder="%"
        />
      </td>
      <td className="buy-sell-cell">—</td>
      <td>
        <button className="remove-btn" onClick={() => onRemove(asset.id)} title="Remove asset">
          ×
        </button>
      </td>
    </tr>
  );
}
