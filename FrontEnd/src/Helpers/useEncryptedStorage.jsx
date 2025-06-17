import {generateUserKey,encryptData,decryptData} from "./cryptData"
import { useState, useEffect } from 'react';

export function useEncryptedStorage(key = 'StorageKey') {
    const secretKey = generateUserKey();
    const limit = parseInt(import.meta.env.VITE_ORDER_LIMIT || '3', 10);
    const today = new Date().toDateString();
  
    const [count, setCount] = useState(0);
  
    useEffect(() => {
      const item = localStorage.getItem(key);
      const data = item ? decryptData(item, secretKey) : null;
  
      if (data?.date === today) {
        setCount(data.count);
      } else {
        const reset = { date: today, count: 0 };
        localStorage.setItem(key, encryptData(reset, secretKey));
        setCount(0);
      }
    }, [key]);
  
    const canOrder = count < limit;
  
    const addOrder = () => {
      if (!canOrder) return false;
  
      const newCount = count + 1;
      const payload = { date: today, count: newCount };
      localStorage.setItem(key, encryptData(payload, secretKey));
      setCount(newCount);
      return true;
    };
  
    return { count, limit, canOrder, addOrder };
  }