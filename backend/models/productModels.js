const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,

    },
    description: {
        type: String,
        required: [true, 'descitption is required']
    },
    price: {
        type: Number,
        required: [true, 'price is required']
    },
    ratings: {
        type: Number,
        default: 0
    },

    images: [
        {
            public_id: {
                type: String,
                required: [true, 'image is required']

            },
            url: {
                type: String,
                required: [true, 'image is required']
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'category is required'],
    },

    stock: {
        type: Number,
        required: [true, 'stock is required'],
        maxLength: [4, 'stock cannot exceed 5 characters'],
        default: 1
    },

    numOfReviews: {
        type: Number,
        default: 0
    },

    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },

            name: {
                type: String,
                required: [true, 'name is required'],

            },
            rating: {
                type: Number,
                required: [true, 'rating is required'],
            },
            comment: {
                type: String,
                required: [true, 'comment is required'],
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },


    createdAt: {
        type: Date,
        default: Date.now
    }


})

module.exports = mongoose.model('Product', productSchema)





