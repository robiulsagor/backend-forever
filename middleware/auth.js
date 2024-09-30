import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized, Please login" })
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!decoded) {
        return res.status(401).json({ success: false, message: "Unauthorized, Please login" })
    }

    req.body.userId = decoded.id
    next()

}

export default auth