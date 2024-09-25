import cloudinary from "../config/cloudinary.js"
import productModel from "../models/productModel.js"

const addProduct = async (req, res)=> {
    const {name, description, price, category, subCategory, sizes, bestSeller} = req.body
    const image1 = req.files.image1 && req.files.image1[0]
    const image2 = req.files.image2 && req.files.image2[0]
    const image3 = req.files.image3 && req.files.image3[0]
    const image4 = req.files.image4 && req.files.image4[0]
    
    const images = [image1, image2, image3 ,image4].filter(item=> item !== undefined)
    
    try {
        let imagesUrl = await Promise.all(
            images.map(async item=> {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: "image"})
                return result.secure_url
            })
        )
        
        const productData = {
            name, description, price: Number(price), image: imagesUrl, category, subCategory, sizes: JSON.parse(sizes), bestSeller: bestSeller === true ? true : false, date: Date.now()
        }

        const product = new productModel(productData)
        await  product.save()

        console.log(product);
        return res.json({success: true, message: "Product has been added"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
    
}

const listProducts = async (req, res)=> {

}

const singleProduct = async (req, res)=> {

}

const deleteProduct = async (req, res)=> {

}

export {addProduct, listProducts, singleProduct, deleteProduct}