import jwt from "jsonwebtoken"

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.status(401).json({ status: false, message: 'Unauthorized' })
        }
        const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET)
        if (decodeToken !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ status: false, message: 'Invalid token' })
        }
        next()
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: error.message })
    }
}

export default adminAuth