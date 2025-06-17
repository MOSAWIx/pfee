const products = [
    {
        "id": 1,
        "title": {
            "en": "Men's Stylish Shirt",
            "fr": "Chemise élégante pour homme",
            "ar": "قميص رجالي أنيق"
        },
        "description": {
            "en": "Available in three colors. Durable and comfortable.",
            "fr": "Disponible en trois couleurs. Durable et confortable.",
            "ar": "متوفر بثلاثة ألوان. متين ومريح."
        },
        "basePrice": 109.99,
        "discount": 0,
        "colors": [
            {
                "name": {
                    "en": "Black",
                    "fr": "Noir",
                    "ar": "أسود"
                },
                "colorHex": "#FF6B6B",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "black-1"
                    },
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "black-2"
                    }
                ]
            },
            {
                "name": {
                    "en": "Blue",
                    "fr": "Bleu",
                    "ar": "أزرق"
                },
                "colorHex": "#FFD93D",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE.jpg?v=1737474394&width=1366",
                        "webpPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE-thumb.jpg",
                        "public_id": "blue-1"
                    }
                ]
            },
            {
                "name": {
                    "en": "Orange",
                    "fr": "Orange",
                    "ar": "برتقالي"
                },
                "colorHex": "#6BCB77",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "orange-1"
                    },
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "orange-2"
                    }
                ]
            }
        ],
        "size": ["S", "M", "L"],
        "taille": ["36", "38", "40"],
        "category": "shirts",
        "stock": 50,
        "rating": 4.6,
        "active": true,
        "createdAt": "2025-05-13T12:00:00Z"
    }, {
        "id": 2,
        "title": {
            "en": "Men's Stylish Shirt",
            "fr": "Chemise élégante pour homme",
            "ar": "قميص رجالي أنيق"
        },
        "description": {
            "en": "Available in three colors. Durable and comfortable.",
            "fr": "Disponible en trois couleurs. Durable et confortable.",
            "ar": "متوفر بثلاثة ألوان. متين ومريح."
        },
        "basePrice": 109.99,
        "discount": 20,
        "colors": [
            {
                "name": {
                    "en": "Black",
                    "fr": "Noir",
                    "ar": "أسود"
                },
                "colorHex": "#eee",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "black-1"
                    },
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "black-2"
                    }
                ]
            },
            {
                "name": {
                    "en": "Blue",
                    "fr": "Bleu",
                    "ar": "أزرق"
                },
                "colorHex": "#dddFF",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE.jpg?v=1737474394&width=1366",
                        "webpPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE-thumb.jpg",
                        "public_id": "blue-1"
                    }
                ]
            },
            {
                "name": {
                    "en": "Orange",
                    "fr": "Orange",
                    "ar": "برتقالي"
                },
                "colorHex": "#FFA500",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "orange-1"
                    },
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "orange-2"
                    }
                ]
            }
        ],
        "size": ["S", "M", "L"],
        "taille": ["36", "38", "40"],
        "category": "shirts",
        "stock": 50,
        "rating": 4.6,
        "active": true,
        "createdAt": "2025-05-13T12:00:00Z"
    }, {
        "id": 3,
        "title": {
            "en": "Men's Stylish Shirt",
            "fr": "Chemise élégante pour homme",
            "ar": "قميص رجالي أنيق"
        },
        "description": {
            "en": "Available in three colors. Durable and comfortable.",
            "fr": "Disponible en trois couleurs. Durable et confortable.",
            "ar": "متوفر بثلاثة ألوان. متين ومريح."
        },
        "basePrice": 109.99,
        "discount": 20,
        "colors": [
            {
                "name": {
                    "en": "Black",
                    "fr": "Noir",
                    "ar": "أسود"
                },
                "colorHex": "#eee",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "black-1"
                    },
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "black-2"
                    }
                ]
            },
            {
                "name": {
                    "en": "Blue",
                    "fr": "Bleu",
                    "ar": "أزرق"
                },
                "colorHex": "#dddFF",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE.jpg?v=1737474394&width=1366",
                        "webpPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE-thumb.jpg",
                        "public_id": "blue-1"
                    }
                ]
            },
            {
                "name": {
                    "en": "Orange",
                    "fr": "Orange",
                    "ar": "برتقالي"
                },
                "colorHex": "#FFA500",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "orange-1"
                    },
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "orange-2"
                    }
                ]
            }
        ],
        "size": ["S", "M", "L"],
        "taille": ["36", "38", "40"],
        "category": "shirts",
        "stock": 50,
        "rating": 4.6,
        "active": true,
        "createdAt": "2025-05-13T12:00:00Z"
    },
    {
        "id": 4,
        "title": {
            "en": "Men's Stylish Shirt",
            "fr": "Chemise élégante pour homme",
            "ar": "قميص رجالي أنيق"
        },
        "description": {
            "en": "Available in three colors. Durable and comfortable.",
            "fr": "Disponible en trois couleurs. Durable et confortable.",
            "ar": "متوفر بثلاثة ألوان. متين ومريح."
        },
        "basePrice": 109.99,
        "discount": 20,
        "colors": [
            {
                "name": {
                    "en": "Black",
                    "fr": "Noir",
                    "ar": "أسود"
                },
                "colorHex": "#ddd00",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "black-1"
                    },
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE.jpg?v=1737474394&width=1366",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "black-2"
                    }
                ]
            },
            {
                "name": {
                    "en": "Blue",
                    "fr": "Bleu",
                    "ar": "أزرق"
                },
                "colorHex": "#dddFF",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE.jpg?v=1737474394&width=1366",
                        "webpPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE-thumb.jpg",
                        "public_id": "blue-1"
                    }
                ]
            },
            {
                "name": {
                    "en": "Orange",
                    "fr": "Orange",
                    "ar": "برتقالي"
                },
                "colorHex": "#FFA500",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "orange-1"
                    },
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "orange-2"
                    }
                ]
            }
        ],
        "size": ["S", "M", "L"],
        "taille": ["36", "38", "40"],
        "category": "shirts",
        "stock": 50,
        "rating": 4.6,
        "active": true,
        "createdAt": "2025-05-13T12:00:00Z"
    },
    {
        "id": 5,
        "title": {
            "en": "Men's Stylish Shirt",
            "fr": "Chemise élégante pour homme",
            "ar": "قميص رجالي أنيق"
        },
        "description": {
            "en": "Available in three colors. Durable and comfortable.",
            "fr": "Disponible en trois couleurs. Durable et confortable.",
            "ar": "متوفر بثلاثة ألوان. متين ومريح."
        },
        "basePrice": 109.99,
        "discount": 20,
        "colors": [
            {
                "name": {
                    "en": "Black",
                    "fr": "Noir",
                    "ar": "أسود"
                },
                "colorHex": "#ddd00",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "black-1"
                    },
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE.jpg?v=1737474394&width=1366",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "black-2"
                    }
                ]
            },
            {
                "name": {
                    "en": "Blue",
                    "fr": "Bleu",
                    "ar": "أزرق"
                },
                "colorHex": "#dddFF",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE.jpg?v=1737474394&width=1366",
                        "webpPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/products/CC390-20Q205BLUE-thumb.jpg",
                        "public_id": "blue-1"
                    }
                ]
            },
            {
                "name": {
                    "en": "Orange",
                    "fr": "Orange",
                    "ar": "برتقالي"
                },
                "colorHex": "#FFA500",
                "images": [
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "orange-1"
                    },
                    {
                        "originalPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.jpg?v=1697655179&width=980",
                        "webpPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5.webp",
                        "thumbnailPath": "https://fashion.sa/cdn/shop/files/S8297SV-23Q400_5-thumb.jpg",
                        "public_id": "orange-2"
                    }
                ]
            }
        ],
        "size": ["S", "M", "L"],
        "taille": ["36", "38", "40"],
        "category": "shirts",
        "stock": 50,
        "rating": 4.6,
        "active": true,
        "createdAt": "2025-05-13T12:00:00Z"
    }
]

export default products