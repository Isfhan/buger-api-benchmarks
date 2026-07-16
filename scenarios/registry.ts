import type { Scenario } from '../src/types';

import { routingStatic } from './routing/static';
import { routingDynamic } from './routing/dynamic';
import { routingWildcard } from './routing/wildcard';
import { routingNested } from './routing/nested';

import { middlewareNone } from './middleware/none';
import { middlewareOne } from './middleware/one';
import { middlewareFive } from './middleware/five';
import { middlewareTen } from './middleware/ten';

import { validationNone } from './validation/none';
import { validationQuery } from './validation/query';
import { validationParams } from './validation/params';
import { validationBody } from './validation/body';

import { requestQueryParsing } from './request/query-parsing';
import { requestResponseMutation } from './request/response-mutation';
import { requestJson } from './request/json';

import { errors404 } from './errors/404';
import { errors405 } from './errors/405';
import { errorsValidation } from './errors/validation-error';

/**
 * Explicit registry of every benchmark scenario. To add a benchmark:
 *   1. Create a scenario file under the relevant group folder.
 *   2. Add it to this list.
 * The runner reads from here; nothing is discovered from the filesystem.
 */
export const scenarios: Scenario[] = [
  routingStatic,
  routingDynamic,
  routingWildcard,
  routingNested,

  middlewareNone,
  middlewareOne,
  middlewareFive,
  middlewareTen,

  validationNone,
  validationQuery,
  validationParams,
  validationBody,

  requestQueryParsing,
  requestResponseMutation,
  requestJson,

  errors404,
  errors405,
  errorsValidation,
];
