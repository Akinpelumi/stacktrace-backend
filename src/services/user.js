import User from '../models';

/**
 * It is the interface for user model.
 *
 * @class UserService
 */
class UserService extends User {
  /**
   * Finds a user with properties specified in the argument.
   * @param {number | object | string} options - An object containing properties to
   * be used as search criteria.
   * @returns {Promise<object>} A promise object with user detail.
   * @memberof UserService
   */
  static async fetch(options = {}) {
    return UserService.find(options).select('-__v -password');
  }

  /**
   * Finds a user by his/her email
   * @param {string} email - User's email address
   * @returns {Promise<object>} A promise object with user detail.
   * @memberof UserService
   */
  static async fetchByEmail(email) {
    return UserService.find({ email }).select('-__v -password');
  }
}

export default UserService;