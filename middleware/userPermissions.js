import { BadRequestError } from "../errors/index.js";

const checkTestUser = (req, res, next) => {
    if (req.user.testUser) {
        throw new BadRequestError("Can't Perform Action. Demo User is Read Only")
    }
    next();
};

export { checkTestUser }