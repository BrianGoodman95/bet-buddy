import { UnAthenticatedError } from '../errors/index.js';

const checkPermissions = (requestUser, resourceUserId) => {
    // if (requestUser.role === 'admin') return

    if (requestUser.userId === resourceUserId.toString()) {
        console.log(requestUser.userId)
        return;
    }
    throw new UnAthenticatedError('Not authorized to access this route');
};

export default checkPermissions;