
const Company = require('../models/Companies');
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

//controller to register a new company
const registerCompany = async (req, res) => {
    try {
        const {
            companyId, companyName, gstin, licenseNumber, cinNumber,
            panCardNumber, aadharCardNumber, contactPersonName,
            contactPersonMobileNumber, contactPersonEmail, state,
            district, taluka, village, companyAddress, pinCode,
            invAlphabetSeries, openingBalance, addedBy
        } = req.body;

        const company = new Company({
            companyId, companyName, gstin, licenseNumber, cinNumber,
            panCardNumber, aadharCardNumber, contactPersonName,
            contactPersonMobileNumber, contactPersonEmail, state,
            district, taluka, village, companyAddress, pinCode,
            invAlphabetSeries, openingBalance, createdBy
        });
        const savedcompany = await company.save();
        console.log("==================")
        //after succefully login we change the complete profile true

        if (savedcompany) {
            const updatedUser = await User.findById(createdBy);
            updatedUser.profileCompleted = true;
            await updatedUser.save();
            await res.status(201).json(savedcompany);
        } else {
            await res.status(403).json(savedcompany);
        }
        console.log("==================");

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const addProduct = async (req, res) => {
    // Validate the request body
    // const errors = validateProduct(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    try {
        const userId = req.user._id;
        console.log("++++++++++++++");
        console.log(userId);
        console.log("++++++++++++++");

        // Find the company in database with reference id  
        const company = await Company.findOne({ createdBy: userId });
        console.log("============");
        console.log(company, "====", "_____",);
        console.log("=============");

        //If user has more than one company registration 
        // const { companyId } = req.body; // Get companyId from the request body
        // const company = await Company.findOne({ _id: companyId, createdBy: userId });

        if (!company) {
            return res.status(400).json({ message: 'Company not found for this user' });
        }

        // Create the product with the companyId
        const newProduct = new Product({
            companyId: company._id,
            companyName: company.companyName,
            addedBy: userId,
            // companyName:req.body.companyName,
            productCategory: req.body.productCategory,
            productName: req.body.productName,
            packingSize: req.body.packingSize,
            openingStock: req.body.openingStock,
            storage: req.body.storage,
            batchNumber: req.body.batchNumber,
            expiryDate: req.body.expiryDate,
            purchasePriceWithoutGST: req.body.purchasePriceWithoutGST,
            gstRate: req.body.gstRate,
            purchasePriceWithGST: req.body.purchasePriceWithGST,
            cashSalePrice: req.body.cashSalePrice,
            creditSalePrice: req.body.creditSalePrice,
            cashWholesalePrice: req.body.cashWholesalePrice,
            creditWholesalePrice: req.body.creditWholesalePrice,
            mrp: req.body.mrp,
            isActive: true,
        });

        await newProduct.save();

        return res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


//update the product 

const updateProduct = async (req, res) => {
    try {
        const addedBy = req.user.id;
        console.log(" update section ", addedBy);
        const { id } = req.params;
        console.log("++++++++");
        console.log("params id ", id);
        console.log("++++++++");

        //check id is mongoid or not
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(
                {
                    message: 'Invalid product ID format'
                });
        }
        //updated data that we want
        const updateData = req.body;
        console.log("updated data we send", updateData);

        const updateProduct = await Product.findOneAndUpdate({
            _id: id, addedBy: addedBy, isActive: true
        },
            updateData,
            { new: true }
        )
        console.log("updated data :", updateProduct);

        if (!updateProduct) {
            return res.status(404).json({
                success: false,
                message: 'product not found or not authorized to update'
            })
        }

        res.status(200).json({
            sucess: true,
            message: "Product updated successfully",
            updateProduct
        })


    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            message: 'Server error: could not update product '
        })
    }

}

//Delete product by only authorized admin
const deleteProduct = async(req, res) => {

    try {
        const addedBy = req.user.id;
        console.log("added by id",addedBy);
        const {id} = req.params;
                //check id is mongoid or not

  
          if (!mongoose.Types.ObjectId.isValid(id)) {
               return res.status(400).json(
                    {
                    message: 'Invalid product ID format'
                    });
                }
        console.log("to delted that product id ",id);
        

        const deletedProduct = await Product.findOneAndDelete({
            _id:id,
             addedBy:addedBy
        });
        console.log("value after find id in db",deletedProduct);
        
        if(!deletedProduct){
            return res.status(404).json({
                success:false,
                message: 'Product not deleted'
            })
        }
        res.status(200).json({
            success:true,
            message:'product deleted successfully!!'
        });
        
        
    } catch (error) {
        console.error("Error to Delete Product:", error);
        res.status(500).json({
            success:false,
            message:'Server error : could not delete the product'
        })
    }
}

module.exports = {
    registerCompany,
    addProduct,
    updateProduct,
    deleteProduct
};