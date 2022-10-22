import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import VSPRequestCollection from './collection';
import UserCollection from '../user/collection';
import * as vspRequestValidator from '../vsprequest/middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';
import * as userUtil from '../user/util';

const router = express.Router();

/**
 * Create a request.
 *
 * @name POST /api/vsprequest
 *
 * @param {string} content - justification for VSP request
 * @return {VSPRequestResponse} - The created request
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const user = await UserCollection.findOneByUserId(userId);
    const vsprequest = await VSPRequestCollection.addOne(user.username, req.body.content);
    res.status(201).json({
      message: 'Request successfully created.',
      vsprequest: util.constructVSPRequestResponse(vsprequest)
    });
  }
);

/**
 * Accept a request.
 *
 * @name PUT /api/vsprequest
 *
 * @param {string} username - The requesting user's username
 * @return {VSPRequestResponse} - The updated request and user
 * 
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn
    // check for admin
  ],
  async (req: Request, res: Response) => {
    const vsprequest = await VSPRequestCollection.acceptOne(req.body.username);
    req.body.VSP = true;
    const user = UserCollection.findOneByUsername(req.body.username);
    const updatedUser = await UserCollection.updateOne((await user)._id, req.body);
    res.status(200).json({
      message: 'Request was successfully accepted.',
      vsprequest: util.constructVSPRequestResponse(vsprequest),
      user: userUtil.constructUserResponse(updatedUser)
    });
  }
);


/**
 * Revoke VSP status.
 * This function makes the assumption that the user has created a VSP request that was granted.
 *
 * @name DELETE /api/vsprequest/vspstatus
 *
 * @param {string} username - The VSP user's username
 * @return {VSPRequestResponse} - The updated request and user
 * 
 */
 router.delete(
  '/vspstatus',
  [
    userValidator.isUserLoggedIn
    // check for admin
  ],
  async (req: Request, res: Response) => {
    const vsprequest = await VSPRequestCollection.ungrantOne(req.body.username);
    req.body.VSP = true;
    req.body.revoke = true;
    const user = UserCollection.findOneByUsername(req.body.username);
    const updatedUser = await UserCollection.updateOne((await user)._id, req.body);
    res.status(200).json({
      message: 'VSP status was successfully revoked.',
      vsprequest: util.constructVSPRequestResponse(vsprequest),
      user: userUtil.constructUserResponse(updatedUser)
    });
  }
);


/**
 * Get all requests.
 *
 * @name GET /api/vsprequest
 *
 * @return {VSPRequestResponse[]} - The updated request
 * 
 */
 router.get(
  '/',
  [
    userValidator.isUserLoggedIn
    // check for admin
  ],
  async (req: Request, res: Response) => {
    const vsprequests = await VSPRequestCollection.getAll();
    res.status(200).json({
      message: 'VSP requests successfully retrieved.',
      vsprequests: vsprequests.map(util.constructVSPRequestResponse)
    });
  }
);

/**
 * Delete a request.
 *
 * @name DELETE /api/vsprequest
 *
 * @param {string} username - The username of the user associated with the VSP request
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    await VSPRequestCollection.deleteOne(req.body.username);
    res.status(200).json({
      message: 'Request was deleted successfully.'
    });
  }
);

export {router as vspRouter};
