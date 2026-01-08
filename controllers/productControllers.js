import { isAdmin } from "./userControllers.js";
import product from '../models/product.js';

// Upload image controller
export async function uploadProductImage(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Access denied. Admins only."
        });
        return;
    }

    try {
        if (!req.file) {
            res.status(400).json({
                message: "No file uploaded"
            });
            return;
        }

        // Return the image path
        const imagePath = `/images/${req.file.filename}`;
        res.status(200).json({
            message: "Image uploaded successfully",
            imagePath: imagePath
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Upload multiple images controller
export async function uploadProductImages(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Access denied. Admins only."
        });
        return;
    }

    try {
        if (!req.files || req.files.length === 0) {
            res.status(400).json({
                message: "No files uploaded"
            });
            return;
        }

        // Return array of image paths
        const imagePaths = req.files.map(file => `/images/${file.filename}`);
        res.status(200).json({
            message: "Images uploaded successfully",
            imagePaths: imagePaths
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}


export async function createProduct(req, res) {
    // Implementation for creating a product
   
   if(!isAdmin(req)){
        res.status(403).json(
            {
                message : "Access denied. Admins only."
            }
        )
        return;
   }
   try {
        // Extract product details from request body
        const existingProduct = await product.findOne
        ({ productId: req.body.productId});

        if (existingProduct) {
            res.status(400).json(
                {
                    message: "Product with this ID already exists."
                }
            );
            return;
        }


        const data={}
        data.productId = req.body.productId;

        if(req.body.name==null){
            res.status(400).json(
                {
                    message : "Product name is required"
                }
            )
            return;
        }
        data.name = req.body.name;
        data.description = req.body.description || "";
        data.altName = req.body.altName || [];
        data.price = req.body.price || 0;
        data.labelledPrice = req.body.labelledPrice || 0;
        data.category = req.body.category || "others";
        data.image = req.body.image || ["/images/default-product.png"];
        data.isVisible = req.body.isVisible != null ? req.body.isVisible : true;
        data.isOnSale = req.body.isOnSale != null ? req.body.isOnSale : false;
        data.brand = req.body.brand || "generic";
        data.model = req.body.model || "standard";
        
        console.log('Creating product with image paths:', data.image);
        
        const newProduct = new product(data);
        await newProduct.save();
        
        console.log('Product saved successfully with images:', newProduct.image);
        
        res.status(201).json(
            {
                message : "Product created successfully",
                product: newProduct
            }
        );
        

        
   } catch (error) {
        res.status(500).json(
            {
                message : "Internal server error"
            }
        )
   }

}

export async function getProducts(req, res) {
    // Implementation for retrieving products
    try {
        if(isAdmin(req)){
        const products = await product.find({ isVisible: true });
            res.status(200).json(products)
        }else{  
            const products = await product.find({ isVisible: true });
            res.status(200).json(products)
        }
    } catch (error) {
        res.status(500).json(
            {
                message : "Internal server error"
            }
        )
    }
    
}

export async function deleteProduct(req, res) {
    // Implementation for deleting a product
    if(!isAdmin(req)){
        res.status(403).json(
            {
                message : "Access denied. Admins only."
            }
        )
        return;
   }
   try {
        const productId = req.params.productId;
        const deletedProduct = await product.findOneAndDelete({ productId: productId });
        if (deletedProduct) {
            res.status(200).json(
                {
                    message: "Product deleted successfully"
                }
            );
        } else {
            res.status(404).json(
                {
                    message: "Product not found"
                }
            );
        }
   } catch (error) {
        res.status(500).json(
            {
                message : "Internal server error"
            }
        )       
        
   }    
}

export async function updateProduct(req, res) {
    // Implementation for updating a product
    if(!isAdmin(req)){
        res.status(403).json(
            {
                message : "Access denied. Admins only."
            }
        )
        return;
   }
    try {
        const productId = req.params.productId;

        // Check if product exists
        const existingProduct = await product.findOne({ productId: productId });
        
        if (!existingProduct) {
            res.status(404).json(
                {
                    message: "Product not found with this ID"
                }
            );
            return;
        }

        if(req.body.name==null){
            res.status(400).json(
                {
                    message : "Product name is required"
                }
            )
            return;
        }

        const data = {};
        data.name = req.body.name;
        data.description = req.body.description || "";
        data.altName = req.body.altName || [];
        data.price = req.body.price || 0;
        data.labelledPrice = req.body.labelledPrice || req.body.price || 0;
        data.category = req.body.category || "others";
        data.image = req.body.image || ["/images/default-product.png"];
        data.isVisible = req.body.isVisible != null ? req.body.isVisible : true;
        data.isOnSale = req.body.isOnSale != null ? req.body.isOnSale : false;
        data.brand = req.body.brand || "generic";
        data.model = req.body.model || "standard";

        await product.updateOne({ productId: productId }, data);

        res.status(200).json(
            {
                message: "Product updated successfully"
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                message : "Internal server error"
            }
        )
    }
}

export async function getProductById(req, res) {
    // Implementation for retrieving a product by ID
    try {
        const productId = req.params.productId;
        const foundProduct = await product.findOne({ productId: productId });

        if (foundProduct == null) {
            res.status(404).json({
                message: "Product not found"
            });
            return;
        }
        
        // If product is not visible, only admin can view it
        if (!foundProduct.isVisible) {
            if (!isAdmin(req)) {
                res.status(403).json({
                    message: "This product is not available"
                });
                return;
            }
        }
        
        res.status(200).json(foundProduct);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Get all products that are on sale
export async function getOnSaleProducts(req, res) {
    try {
        const products = await product.find({ isVisible: true, isOnSale: true });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Toggle product on sale status
export async function toggleProductOnSale(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Access denied. Admins only."
        });
        return;
    }

    try {
        const productId = req.params.productId;
        const foundProduct = await product.findOne({ productId: productId });

        if (!foundProduct) {
            res.status(404).json({
                message: "Product not found"
            });
            return;
        }

        // Toggle the isOnSale status
        foundProduct.isOnSale = !foundProduct.isOnSale;
        await foundProduct.save();

        res.status(200).json({
            message: foundProduct.isOnSale ? "Product added to sale" : "Product removed from sale",
            isOnSale: foundProduct.isOnSale
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}