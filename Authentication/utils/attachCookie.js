const attachCookie = ({ res, token }) => {
    const OneDay = 1000 * 60 * 60 * 24;

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + OneDay),
        secure: process.env.NODE_ENV
    })
}

export default attachCookie;