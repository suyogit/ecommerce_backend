//creating a jwt token and storing in cookie
const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
    //options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), //cookie will expire after 30 days
        httpOnly: true
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
}
module.exports = sendToken;