import { isAdmin } from "./userControllers.js";
import product from '../models/product.js';

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
        data.brand = req.body.brand || "generic";
        data.model = req.body.model || "standard";
        const newProduct = new product(data);
        await newProduct.save();
        res.status(201).json(
            {
                message : "Product created successfully"
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
        const foundProduct = await product.findOne({ productId:productId});

        if(product== null){
            res.status(404).json(
                {
                    message : "Product not found"
                }
            )
            return;
        }
        if(!product.isVisible){
            if(!isAdmin(req)){
                res.status(403).json(
                    {
                        message : "Access denied. Admins only."
                    }
                )
                return;
            }
        }
        res.status(200).json(foundProduct);
    } catch (error) {
        res.status(500).json(
            {
                message : "Internal server error"
            }
        )
    }
    
}

  