import {
  createInstance,
  createStaticProjectConfigManager,
  createPollingProjectConfigManager,
  createOdpManager,
  createBatchEventProcessor,
  createForwardingEventProcessor,
  createLogger,
  DebugLog,
  Client,
  NOTIFICATION_TYPES,
  createErrorNotifier,
} from "@optimizely/optimizely-sdk";
import {
  sendOdpEvent,
  fetchQualifiedSegments,
  getDecision,
  sendOdpEventWithDelay,
  trackEventWithDelay,
  trackEvent,
  getDecisionInvalid,
} from "./action";

import datafile from "./datafile.json";

type TestMode = "before" | "after" | "both";

const getClient1 = () => {
  /**
   * Optimizely client is instantiated with a static project config manager and an odp manager
   */
  const staticProjectConfigManager = createStaticProjectConfigManager({
    datafile: JSON.stringify(datafile),
  });

  const odpManager = createOdpManager();
  const logger = createLogger({
    level: DebugLog,
  });

  const optimizely = createInstance({
    projectConfigManager: staticProjectConfigManager,
    odpManager,
    logger,
  });

  return {
    client: optimizely,
    actions: [getDecision, fetchQualifiedSegments, sendOdpEvent],
  };
};

const getClient2 = () => {
  /**
   *  Optimizely client is created with a polling config manager with both sdkKey and datafile, and an odp manager
   */
  const pollingProjectConfigManager = createPollingProjectConfigManager({
    datafile: JSON.stringify(datafile),
    sdkKey: process.env.EXPO_PUBLIC_ODP_CHECK!,
  });

  const odpManager = createOdpManager();
  const logger = createLogger({
    level: DebugLog,
  });

  const optimizely = createInstance({
    projectConfigManager: pollingProjectConfigManager,
    odpManager,
    logger,
  });

  return {
    client: optimizely,
    actions: [getDecision, fetchQualifiedSegments, sendOdpEvent],
  };
};

const getClient3 = () => {
  /**
   * Optimizely client is created with a polling config manager with autoupdate and an odp manager with
   * eventBatchSize 3 and flush interval 5 minute. A notification listener is added for project config update event.
   */
  const pollingProjectConfigManager = createPollingProjectConfigManager({
    sdkKey: process.env.EXPO_PUBLIC_ODP_CHECK!,
    autoUpdate: true,
  });
  const odpManager = createOdpManager({
    eventBatchSize: 3,
    eventFlushInterval: 5 * 60 * 1000, // 5 minutes
  });

  const client = createInstance({
    projectConfigManager: pollingProjectConfigManager,
    odpManager,
  });

  client?.notificationCenter.addNotificationListener(
    NOTIFICATION_TYPES.OPTIMIZELY_CONFIG_UPDATE,
    (payload) => {
      console.log("Project config updated", payload);
    }
  );

  return {
    client,
    actions: [sendOdpEvent, sendOdpEvent, sendOdpEventWithDelay(5000)],
  };
};

const getClient4 = () => {
  /**
   * Optimizely client is created with a polling config manager and a forwarding event processor,
   * and TRACK and  LOG_EVENT notification listeners are added
   */
  const pollingProjectConfigManager = createPollingProjectConfigManager({
    sdkKey: process.env.EXPO_PUBLIC_OPTIMIZELY_SDK_KEY!,
  });
  const forwardingEventProcessor = createForwardingEventProcessor();
  const client = createInstance({
    projectConfigManager: pollingProjectConfigManager,
    eventProcessor: forwardingEventProcessor,
  });

  client?.notificationCenter.addNotificationListener(
    NOTIFICATION_TYPES.TRACK,
    (payload) => {
      console.log("Track event", payload);
    }
  );
  client?.notificationCenter.addNotificationListener(
    NOTIFICATION_TYPES.LOG_EVENT,
    (payload) => {
      console.log("Log event", payload);
    }
  );
  return {
    client,
    actions: [getDecision, trackEventWithDelay(5000)],
  };
};

const getClient5 = () => {
  /**
   * Optimizely client is created with a polling config manager and a forwarding event processor with a custom eventDispatcher.
   */
  const pollingProjectConfigManager = createPollingProjectConfigManager({
    sdkKey: process.env.EXPO_PUBLIC_OPTIMIZELY_SDK_KEY!,
  });
  const forwardingEventProcessor = createForwardingEventProcessor({
    dispatchEvent: (event) =>
      new Promise((resolve) => {
        console.log("Custom event dispatcher", event);
        resolve({ statusCode: 200 });
      }),
  });

  const client = createInstance({
    projectConfigManager: pollingProjectConfigManager,
    eventProcessor: forwardingEventProcessor,
  });
  return {
    client,
    actions: [trackEvent],
  };
};

const getClient6 = () => {
  /**
   * Optimizely client is created with a polling config manager
   * and a batch event processor with batchSize 3 and flush interval 10seconds,
   * and TRACK and LOG_EVENT notification listener are added
   */
  const pollingProjectConfigManager = createPollingProjectConfigManager({
    sdkKey: process.env.EXPO_PUBLIC_OPTIMIZELY_SDK_KEY!,
  });
  const batchEventProcessor = createBatchEventProcessor({
    batchSize: 3,
    flushInterval: 10 * 1000, // 10 seconds
  });

  const client = createInstance({
    projectConfigManager: pollingProjectConfigManager,
    eventProcessor: batchEventProcessor,
    logger: createLogger({
      level: DebugLog,
    }),
  });

  client?.notificationCenter.addNotificationListener(
    NOTIFICATION_TYPES.TRACK,
    (payload) => {
      console.log("Track event", payload);
    }
  );
  client?.notificationCenter.addNotificationListener(
    NOTIFICATION_TYPES.LOG_EVENT,
    (payload) => {
      console.log("Log event", payload);
    }
  );

  return {
    client,
    actions: [
      trackEvent,
      trackEvent,
      trackEventWithDelay(15000),
      trackEventWithDelay(15000),
      trackEventWithDelay(15000),
    ],
  };
};

const getClient7 = () => {
  /**
   * Optimizely client is created with a polling config manager and a batch event processor with batchSize 3,
   *  flush interval 10seconds and a custom event dispatcher
   */
  const pollingProjectConfigManager = createPollingProjectConfigManager({
    sdkKey: process.env.EXPO_PUBLIC_OPTIMIZELY_SDK_KEY!,
  });
  const batchEventProcessor = createBatchEventProcessor({
    batchSize: 3,
    flushInterval: 10 * 1000, // 10 seconds
    eventDispatcher: {
      dispatchEvent: (event) =>
        new Promise((resolve) => {
          console.log("Custom event dispatcher", event);
          resolve({ statusCode: 200 });
        }),
    },
  });

  const client = createInstance({
    projectConfigManager: pollingProjectConfigManager,
    eventProcessor: batchEventProcessor,
  });

  return {
    client,
    actions: [
      trackEvent,
      trackEvent,
      trackEventWithDelay(15000),
      trackEventWithDelay(15000),
      trackEventWithDelay(15000),
    ],
  };
};

const getClient8 = () => {
  /**
   * Optimizely client is created with a polling config manager, and a DECISION notification listener is added
   */

  const pollingProjectConfigManager = createPollingProjectConfigManager({
    sdkKey: process.env.EXPO_PUBLIC_OPTIMIZELY_SDK_KEY!,
  });
  const client = createInstance({
    projectConfigManager: pollingProjectConfigManager,
  });

  client?.notificationCenter.addNotificationListener(
    NOTIFICATION_TYPES.DECISION,
    (payload) => {
      console.log("Decision event", payload);
    }
  );

  return {
    client,
    actions: [getDecision],
  };
};

const getClient9 = () => {
  /**
   * Optimizely client is created with a polling config manager and a logger with DebugLog level
   */
  const pollingProjectConfigManager = createPollingProjectConfigManager({
    sdkKey: process.env.EXPO_PUBLIC_OPTIMIZELY_SDK_KEY!,
  });

  const logger = createLogger({
    level: DebugLog,
  });

  const client = createInstance({
    projectConfigManager: pollingProjectConfigManager,
    logger,
  });

  return {
    client,
    actions: [getDecision, getDecisionInvalid],
  };
};

const getClient10 = () => {
  /**
   * Optimizely client is created with a polling config manager with just an sdkKey, and a custom error handler
   */
  const pollingProjectConfigManager = createPollingProjectConfigManager({
    sdkKey: process.env.EXPO_PUBLIC_OPTIMIZELY_SDK_KEY!,
  });
  const errorNotifier = createErrorNotifier({
    handleError: (error) => {
      console.error("Custom error handler", error);
    },
  });
  const client = createInstance({
    projectConfigManager: pollingProjectConfigManager,
    errorNotifier,
  });

  return {
    client,
    actions: [getDecision],
  };
};

// Test mode configuration
const runTests = (
  optimizely: Client,
  actions: Array<(client: Client) => any>,
  mode: TestMode = "both"
) => {
  // Run tests before onReady
  if (mode === "before" || mode === "both") {
    console.log("=== RUNNING TESTS BEFORE onReady ===");
    actions.forEach((action) => action(optimizely));
  }

  // Run tests after onReady
  if (mode === "after" || mode === "both") {
    console.log("=== WAITING FOR onReady TO RUN REMAINING TESTS ===");
    optimizely
      .onReady()
      .then(() => {
        console.log("=== RUNNING TESTS AFTER onReady ===");
        console.log("Optimizely SDK is ready");
        actions.forEach((action) => action(optimizely));
      })
      .catch((err) => {
        console.error("Error initializing Optimizely SDK", err);
      });
  }
};

// (() => {
//   const { client, actions } = getClient8();
//   const TEST_MODE: TestMode = "after"; // Change this to control test execution

//   if (client) {
//     runTests(client, actions, TEST_MODE);
//   } else {
//     console.error("Optimizely client not initialized");
//   }
// })();
export const getOptimizelyDecision = () => {
  const { client, actions } = getClient7();
  const TEST_MODE: TestMode = "before"; // Change this to control test execution
  if (client) {
    runTests(client, actions, TEST_MODE);
  } else {
    console.error("Optimizely client not initialized");
  }
};
// Export for potential external access if needed
// export { testActions, optimizely, runTests };
