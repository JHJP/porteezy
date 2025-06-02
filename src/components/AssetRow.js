import React from "react";

export default function AssetRow({ asset, onChange, onRemove }) {
  return (
    <tr className="asset-row">
      <td>
        <input
          type="text"
          value={asset.ticker}
          onChange={(e) => onChange(asset.id, "ticker", e.target.value)}
          placeholder="Ticker"
        />
      </td>
      <td>
        <input
          type="text"
          value={asset.currentPrice || "--"}
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
