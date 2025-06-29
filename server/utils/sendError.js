
const sendError = (res, { statusCode = 500, message = "Server error. Please try again later!" } = {}) => {
   return res.status(statusCode).json({ status: false, message });
}
export default sendError;
