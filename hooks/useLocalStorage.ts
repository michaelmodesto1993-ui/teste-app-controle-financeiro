import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            // If no item exists, return the initial value.
            if (item === null) {
                return initialValue;
            }

            const parsedItem = JSON.parse(item);
            
            // If stored item is explicitly null, fall back.
            if (parsedItem === null) {
                return initialValue;
            }

            // If we expect an array, validate the stored data structure.
            if (Array.isArray(initialValue)) {
                // 1. Check if the stored value is an array.
                if (!Array.isArray(parsedItem)) {
                    console.warn(`Invalid data type for key "${key}". Expected array, got ${typeof parsedItem}. Falling back.`);
                    return initialValue;
                }
                // 2. Check for invalid entries (like null or primitives) within the array which cause runtime errors.
                if (parsedItem.some(val => val === null || typeof val !== 'object')) {
                    console.warn(`Invalid item found in array for key "${key}". Falling back to default to prevent crash.`);
                    return initialValue;
                }
            }

            return parsedItem;
        } catch (error) {
            console.error(`Error reading or parsing localStorage key “${key}”, falling back to initial value:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

export default useLocalStorage;