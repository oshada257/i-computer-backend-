import Order from '../models/order.js';
import Product from '../models/product.js';
import { isAdmin } from './userControllers.js';

// Generate unique order ID
const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp.slice(-6)}-${random.toUpperCase()}`;
};

// Create new order
export async function createOrder(req, res) {
    try {
        const userId = req.user.id;
        const {
            customerInfo,
            shippingAddress,
            items,
            paymentInfo
        } = req.body;

        // Validate required fields
        if (!customerInfo || !shippingAddress || !items || items.length === 0) {
            return res.status(400).json({
                message: "Missing required fields: customerInfo, shippingAddress, or items"
            });
        }

        // Validate and calculate order items
        let subtotal = 0;
        const validatedItems = [];

        for (const item of items) {
            // Verify product exists
            const product = await Product.findOne({ productId: item.productId });
            if (!product) {
                return res.status(404).json({
                    message: `Product with ID ${item.productId} not found`
                });
            }

            if (!product.isVisible) {
                return res.status(400).json({
                    message: `Product ${product.name} is not available`
                });
            }

            const totalPrice = product.price * item.quantity;
            subtotal += totalPrice;

            validatedItems.push({
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity,
                price: product.price,
                totalPrice: totalPrice,
                image: product.image[0] || "/images/default-product.png"
            });
        }

        // Calculate totals
        const tax = subtotal * 0.1; // 10% tax
        const shipping = subtotal > 5000 ? 0 : 500; // Free shipping above Rs. 5000
        const total = subtotal + tax + shipping;

        // Create order
        const newOrder = new Order({
            orderId: generateOrderId(),
            userId: userId,
            customerInfo: customerInfo,
            shippingAddress: shippingAddress,
            items: validatedItems,
            orderSummary: {
                subtotal: subtotal,
                tax: tax,
                shipping: shipping,
                discount: 0,
                total: total
            },
            paymentInfo: {
                method: paymentInfo?.method || 'cash_on_delivery',
                status: 'pending'
            }
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: "Order created successfully",
            order: savedOrder
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Get all orders for the logged-in user
export async function getUserOrders(req, res) {
    try {
        const userId = req.user.id;
        
        const orders = await Order.find({ userId: userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'firstName lastName email');

        res.status(200).json({
            orders: orders
        });

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Get specific order by ID
export async function getOrderById(req, res) {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        
        const order = await Order.findOne({ orderId: orderId })
            .populate('userId', 'firstName lastName email');

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Users can only access their own orders, admins can access any order
        if (order.userId._id.toString() !== userId && !isAdmin(req)) {
            return res.status(403).json({
                message: "Access denied. You can only view your own orders."
            });
        }

        res.status(200).json(order);

    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Get all orders (Admin only)
export async function getAllOrders(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "Access denied. Admins only."
        });
    }

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'firstName lastName email');

        const totalOrders = await Order.countDocuments();

        res.status(200).json({
            orders: orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders: totalOrders,
                hasNext: page < Math.ceil(totalOrders / limit),
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Update payment status
export async function updateOrderPaymentStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status, transactionId } = req.body;
        const userId = req.user.id;

        if (!status || !['pending', 'completed', 'failed', 'refunded'].includes(status)) {
            return res.status(400).json({
                message: "Invalid payment status"
            });
        }

        const order = await Order.findOne({ orderId: orderId });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Users can only update their own orders, admins can update any order
        if (order.userId.toString() !== userId && !isAdmin(req)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        // Update payment info
        order.paymentInfo.status = status;
        if (transactionId) {
            order.paymentInfo.transactionId = transactionId;
        }
        if (status === 'completed') {
            order.paymentInfo.paidAt = new Date();
        }

        await order.save();

        res.status(200).json({
            message: "Payment status updated successfully",
            order: order
        });

    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}