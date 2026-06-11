import { Request, Response } from "express";
import { AppError } from "../../../utils/AppError";
import { User_Events, User_Jobs } from "./clerk.types";
import { userQueue } from "./clerk.queue";
import { Webhook } from "svix";
import { config } from "../../../config/config";
import { randomInt } from "crypto";

//creating the handler for the clerk webhook
export const clerkUserHandler = async (req: Request, res: Response) => {
  //take the svix header details from the header
  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  //check the svix header is present or not
  if (!svix_id || !svix_signature || !svix_timestamp) {
    throw new AppError(404, "svix header not found");
  }

  //take the req body from request
  const body = req.body.toString();

  //crete the new webhook instance to verify the webhook
  const webhook = new Webhook(config.clerkWebhookSecret);

  //verify the webhook
  const evt = webhook.verify(body, {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  }) as any;

  //take the events from the webhook event types
  const eventType = evt.type;

  //switch the event and send to the queue
  switch (eventType) {
    //for the case user created
    case User_Events.User_Created:
      await userQueue.add(
        User_Jobs.Create_User,
        {
          _id: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          profile_image: evt.data.image_url,
          name: evt.data.first_name + " " + evt.data.last_name,
        },
        {
          jobId: evt.data.id,
        },
      );
      break;

    //for the case user updated
    case User_Events.User_Updated:
      await userQueue.add(User_Jobs.Update_User, {
        _id: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        profile_image: evt.data.image_url,
        name: evt.data.first_name + " " + evt.data.last_name,
      });
      break;

    //for the case user delete
    case User_Events.User_Deleted:
      await userQueue.add(User_Jobs.Delete_User, { _id: evt.data.id });
      break;
  }

  //return the success response
  return res.sendStatus(200);
};
