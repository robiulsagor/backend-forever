import userModel from "../models/userModel.js"

const addToCart = async (req, res) => {
    const { userId, productId, quantity, size } = req.body
    const userData = await userModel.findById(userId)
    let cartData = userData.cartData

    let itemExists = false

    cartData.map(item => {
        if (item.id === productId && item.size === size) {
            itemExists = true
            item.count += 1
        }
        return item
    })

    if (!itemExists) {
        cartData.push({ id: productId, size, count: 1 })
    }

    await userModel.findByIdAndUpdate(userId, { cartData })
    return res.status(200).json({ success: true, message: "Product added to cart successfully" })
}

const updateCart = async (req, res) => {
    const { userId, productId, quantity, size } = req.body

    try {
        const userData = await userModel.findById(userId)
        let cartData = userData.cartData

        cartData.map(item => {
            if (item.id === productId && item.size === size) {
                item.count = Number(quantity)
            }
            return item
        })

        await userModel.findByIdAndUpdate(userId, { cartData })
        return res.status(200).json({ success: true, message: "Cart updated successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error updating cart", error })
    }
}

const getCart = async (req, res) => {
    const { userId } = req.body
    try {
        const userData = await userModel.findById(userId)
        let cartData = userData.cartData
        res.status(200).json({ success: true, cartData, message: "Cart fetched successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error fetching cart" })
    }
}

const deleteItem = async (req, res) => {
    const { userId, productId, size } = req.body
    try {
        const userData = await userModel.findById(userId)
        let cartData = userData.cartData

        cartData = cartData.filter(item => !(item.id === productId && item.size === size))

        await userModel.findByIdAndUpdate(userId, { cartData })
        return res.status(200).json({ success: true, message: "Item deleted from cart successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error deleting item" })
    }


}

export { addToCart, updateCart, getCart, deleteItem }
