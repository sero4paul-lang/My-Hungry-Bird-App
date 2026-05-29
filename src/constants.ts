export const VERSE_WALLET_ADDRESS = '0xdD0e953DEa9e1265feD476d590b8e6320Cc201c6';
export const VERSE_LOGO_URL = 'https://lh3.googleusercontent.com/d/16A9AFdJNQTZEIqoK0nYs8yKCVfcPvcIj';
export const LOGO_PATH = 'https://lh3.googleusercontent.com/d/1gXR5q_jqgEYIZCl03Q7evwwtZ9_X9iIg';
export const WHATSAPP_NUMBER = '2348154247467';

export const BANK_DETAILS = {
    accountNumber: '0166053769',
    bankName: 'UNION BANK',
    accountName: 'Hungry Bird'
};

export const PACKAGES = [
    { 
        id: 'breakfast-support', 
        name: "Breakfast Support Pack", 
        price: 5000,
        description: "A nutritious start for someone special",
        image: 'https://lh3.googleusercontent.com/d/1C62g1yaPuDJBIk-JQJPYThUgJTRceTs6'
    },
    { 
        id: 'family-food', 
        name: "Family Food Pack", 
        price: 10000,
        description: "Full meal support for the whole family",
        image: 'https://lh3.googleusercontent.com/d/1M5bFNysFwtExBPS_rN5vd3WGSi0aSsPJ'
    },
    { 
        id: 'full-meal', 
        name: "Full Meal Pack", 
        price: 15000,
        description: "Premium food package for complete care",
        image: 'https://lh3.googleusercontent.com/d/17QXETpl1Xy3GGdeudNrteh7zqK4JAZwQ'
    }
];

export const PRODUCTS = PACKAGES.map(p => ({
    ...p,
    category: 'Gifting Packages',
    numericPrice: p.price,
    price: `₦${p.price.toLocaleString()}`
}));
