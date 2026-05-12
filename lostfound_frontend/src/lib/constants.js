import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const CATEGORIES = [
  { name: "Mobiles",          icon: "smartphone"   },
  { name: "Wallets",          icon: "wallet"       },
  { name: "Keys",             icon: "key-round"    },
  { name: "Accessories",      icon: "watch"        },
  { name: "Bags",             icon: "shopping-bag"  },
  { name: "Makeup",           icon: "sparkles"     },
  { name: "Notebooks/Books",  icon: "book-open"    },
  { name: "Other",            icon: "package"      },
];

export function createApi(token) {
  return axios.create({
    baseURL: API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export const spring = { type: 'spring', stiffness: 400, damping: 28 };
export const springGentle = { type: 'spring', stiffness: 260, damping: 24 };
