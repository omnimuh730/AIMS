import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ApplierContext = createContext({ applier: null, setApplier: () => {} });

export const ApplierProvider = ({ children }) => {
  const [applier, setApplier] = useState(null);

  // Initialize from localStorage for persistence on reload
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mainUser');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed._id && parsed.name) setApplier(parsed);
      }
    } catch {}
  }, []);

  // Persist whenever it changes
  useEffect(() => {
    try {
      if (applier) localStorage.setItem('mainUser', JSON.stringify(applier));
    } catch {}
  }, [applier]);

  const value = useMemo(() => ({ applier, setApplier }), [applier]);
  return <ApplierContext.Provider value={value}>{children}</ApplierContext.Provider>;
};

export const useApplier = () => useContext(ApplierContext);

export default ApplierContext;

