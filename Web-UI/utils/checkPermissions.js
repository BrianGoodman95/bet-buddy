import { UnAthenticatedError } from '../errors/index.js';

const checkPermissions = (requestUser, resourceUserId) => {
    // if (requestUser.role === 'admin') return

    if (requestUser.userId === resourceUserId.toString()) {
        return;
    }
    console.log(requestUser.userId, resourceUserId.toString());
    throw new UnAthenticatedError('Not authorized to access this data');
};

export default checkPermissions;