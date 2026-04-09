// WSContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

// Create context
export const WSContext = createContext(null);

// Context provider component
export const WSProvider = ({ children }) => {
  const [_wsMessageCart, setWSMessageCart] = useState("{}");
  const [_wsMessageCartInfo, setWSMessageCartInfo] = useState("{}");
  const [_wsMessageMenuItem, setWSMessageMenuItem] = useState("{}");
  const [_wsMessageSuggest, setWSMessageSuggest] = useState("{}");
  const [_wsMessageOrders, setWSMessageOrders] = useState("{}");
  const [_wsMessageRequests, setWSMessageRequests] = useState("{}");
  const [_wsMessageFav, setWSMessageFav] = useState("{}");
  const [_wsMessageNode, setWSMessageNode] = useState("{}");
  const [_wsMessageAccounting, setWSMessageAccounting] = useState("{}");

  return (
    <WSContext.Provider
      value={{
        _wsMessageCart,
        setWSMessageCart,
        _wsMessageMenuItem,
        setWSMessageMenuItem,
        _wsMessageSuggest,
        _wsMessageOrders,
        setWSMessageOrders,
        _wsMessageRequests,
        setWSMessageRequests,
        setWSMessageSuggest,
        _wsMessageAccounting,
        setWSMessageAccounting,
        _wsMessageCartInfo,
        setWSMessageCartInfo,
        _wsMessageFav,
        setWSMessageFav,
        _wsMessageNode,
        setWSMessageNode,
      }}
    >
      {children}
    </WSContext.Provider>
  );
};

// Custom hook to consume the context
export const useWS = () => useContext(WSContext);
