import type { PureSpyEvent } from "mobx/dist/core/spy";
import { IEqualsComparer } from "mobx";
import { Logger } from "./logger";

type SpyEvent = PureSpyEvent & {
  object: any;
  name: string;
};

export type LogOptions = {
  logger: Logger;
  compare: IEqualsComparer<unknown>;
};

export const log = (event: SpyEvent, options: LogOptions): void => {
  const { logger, compare } = options;

  if (event.type === "update") {
    if (event.observableKind === "computed") {
      if (!compare(event.oldValue, event.newValue)) {
        logger.logComputed({
          name: event.debugObjectName,
          oldValue: event.oldValue,
          newValue: event.newValue,
        });
      }
    }
    if (event.observableKind === "object") {
      logger.logObservable({
        name: `${event.debugObjectName}.${event.name}`,
        newValue: event.newValue,
        oldValue: event.oldValue,
      });
    }
  }
  if (event.type === "action") {
    const storeName = event.object?.constructor.name ?? '<unnamed store>'
    logger.logAction({
      name: `${storeName}.${event.name}`,
      arguments: event.arguments
    });
  }
};
