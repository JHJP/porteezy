import React, { useState } from "react";
import AssetRow from "./AssetRow";

const initialAssets = [
  { id: 1, ticker: "AAPL", avgPrice: "", holdings: "", targetWeight: "" },
];

export default function AssetTable() {
  const [assets, setAssets] = useState(initialAssets);
  const [cash, setCash] = useState("");

  // Placeholder handlers for UI only
  const handleAddAsset = () => {
    setAssets([
      ...assets,
      { id: Date.now(), ticker: "", avgPrice: "", holdings: "", targetWeight: "" },
    ]);
  };
  const handleRemoveAsset = (id) => {
    setAssets(assets.filter((asset) => asset.id !== id));
  };
  const handleAssetChange = (id, field, value) => {
    setAssets(
      assets.map((asset) =>
        asset.id === id ? { ...asset, [field]: value } : asset
      )
    );
  };
  return (
    <div className="asset-table-container">
      <div className="cash-row">
        <label htmlFor="cash">Cash:</label>
        <input
          id="cash"
          type="number"
          min="0"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
          placeholder="$0.00"
        />
      </div>
      <table className="asset-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Current Price</th>
            <th>Avg Price</th>
            <th>Holdings</th>
            <th>Target %</th>
            <th>Buy/Sell</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <AssetRow
              key={asset.id}
              asset={asset}
              onChange={handleAssetChange}
              onRemove={handleRemoveAsset}
            />
          ))}
        </tbody>
      </table>
      <button className="add-asset-btn" onClick={handleAddAsset}>
        + Add Asset
      </button>
    </div>
  );
}
