import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },

        customerInfo: {
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            }
        },

        shippingAddress: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            zipCode: {
                type: String,
                required: true
            },
            country: {
                type: String,
                default: "Sri Lanka"
            }
        },

        items: [{
            productId: {
                type: String,
                required: true
            },
            productName: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            },
            totalPrice: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                default: "/images/default-product.png"
            }
        }],

        orderSummary: {
            subtotal: {
                type: Number,
                required: true
            },
            tax: {
                type: Number,
                default: 0
            },
            shipping: {
                type: Number,
                default: 0
            },
            discount: {
                type: Number,
                default: 0
            },
            total: {
                type: Number,
                required: true
            }
        },

        paymentInfo: {
            method: {
                type: String,
                enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
                default: 'cash_on_delivery'
            },
            status: {
                type: String,
                enum: ['pending', 'completed', 'failed', 'refunded'],
                default: 'pending'
            },
            transactionId: {
                type: String
            },
            paidAt: {
                type: Date
            }
        },

        notes: {
            type: String
        }
    },
    {
        timestamps: true // This adds createdAt and updatedAt automatically
    }
);

// Index for faster queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });

// Virtual for order date formatting
orderSchema.virtual('formattedOrderDate').get(function() {
    return this.createdAt.toLocaleDateString();
});

// Method to calculate total
orderSchema.methods.calculateTotal = function() {
    const subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.orderSummary.subtotal = subtotal;
    this.orderSummary.total = subtotal + this.orderSummary.tax + this.orderSummary.shipping - this.orderSummary.discount;
    return this.orderSummary.total;
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
