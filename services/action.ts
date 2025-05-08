import { Client } from "@optimizely/optimizely-sdk";

/**
 * Delay Helper:
 */

const delayAction = (
  action: (client: Client) => void,
  delay: number,
  client: Client
) => {
  setTimeout(() => {
    action(client);
  }, delay);
};

/**
 *
 * Actions:
 */

export const getDecision = (client: Client) => {
  const userContext = client.createUserContext("user_id");
  const decision = userContext?.decide("flag3");
  console.log("Decision", decision);
  return decision;
};

export const fetchQualifiedSegments = (client: Client) => {
  const userContext = client.createUserContext("user_id");
  return userContext
    ?.fetchQualifiedSegments()
    .then((res) => {
      console.log("Qualified Segments", res);
      return res;
    })
    .catch((error) => {
      console.error("Error fetching qualified segments:", error);
    });
};

export const sendOdpEvent = (client: Client) => {
  console.log("sendOdpEvent called");
  const identifiers = new Map();
  identifiers.set("fs_user_id", "user_id");
  client.sendOdpEvent("test_event", "test", identifiers);
};

export const sendOdpEventWithDelay = (delay: number) => (client: Client) => {
  delayAction(sendOdpEvent, delay, client);
};

export const trackEvent = (client: Client) => {
  console.log("trackEvent called");
  const userContext = client.createUserContext("user_id");
	 // This must match with the event key in Optimizely app.
  userContext?.trackEvent("purchase");
};

export const trackEventWithDelay = (delay: number) => (client: Client) => {
  delayAction(trackEvent, delay, client);
};
