import type {HydratedDocument, Types} from 'mongoose';
import type {User} from './model';
import UserModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(username: string, password: string): Promise<HydratedDocument<User>> {
    const dateJoined = new Date();
    let VSP = false;
    let interests = new Array;
    let followers = new Array;
    let following = new Array;

    const user = new UserModel({username, password, dateJoined, VSP, interests, followers, following});
    await user.save(); // Saves user to MongoDB
    return user;
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({_id: userId});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({username: new RegExp(`^${username?.trim()}$`, 'i')});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated information
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: any): Promise<HydratedDocument<User>> {
    console.log(userDetails);
    const user = await UserModel.findOne({_id: userId});
    // update password
    if (userDetails.password) {
      user.password = userDetails.password as string;
    }
    // update username
    if (userDetails.username) {
      user.username = userDetails.username as string;
    }
    // // update VSP status
    // if (userDetails.VSP) {
    //   user.VSP = userDetails.VSP as boolean;
    // }
    // update interests
    if (userDetails.interests) { // just one new interest
      user.interests.push(userDetails.interests as string)
    }
    // update following, will automatically update followers of new user
    if (userDetails.following && !userDetails.unfollow) { // should just be one new following username
      const followedUser = await UserModel.findOne({username: userDetails.following as string});
      user.following.push(userDetails.following as string);
      followedUser.followers.push(user.username);
      await followedUser.save();
    }
    // unfollow a user
    if (userDetails.following && userDetails.unfollow) { // should just be one new following username
      const followedUser = await UserModel.findOne({username: userDetails.following as string});
      const index = followedUser.followers.indexOf(userId as string, 0);
      if (index > -1) {
        followedUser.followers.splice(index, 1);
      }
      const index2 = user.following.indexOf(userDetails.following as string, 0);
      if (index2 > -1) {
        user.following.splice(index2, 1);
      }
      await followedUser.save();
    }
    await user.save();
    return user;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.deleteOne({_id: userId});
    return user !== null;
  }
}

export default UserCollection;
