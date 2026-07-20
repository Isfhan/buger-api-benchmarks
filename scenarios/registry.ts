import type { Scenario } from '../src/types';

import { routingStatic } from './routing/static';
import { routingDynamic } from './routing/dynamic';
import { routingWildcard } from './routing/wildcard';
import { routingNested } from './routing/nested';

import { validationNone } from './validation/none';
import { validationQuery } from './validation/query';
import { validationParams } from './validation/params';
import { validationBody } from './validation/body';
import { validationCoerce } from './validation/coerce';
import { validationResponse } from './validation/response';

import { requestQueryParsing } from './request/query-parsing';
import { requestResponseMutation } from './request/response-mutation';
import { requestJson } from './request/json';

import { errors404 } from './errors/404';
import { errors405 } from './errors/405';
import { errorsValidation } from './errors/validation-error';

import { phase1DevStatic } from './phase1/dev-static';
import { phase1DevDynamic } from './phase1/dev-dynamic';

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

  validationNone,
  validationQuery,
  validationParams,
  validationBody,
  validationCoerce,
  validationResponse,

  requestQueryParsing,
  requestResponseMutation,
  requestJson,

  errors404,
  errors405,
  errorsValidation,

  phase1DevStatic,
  phase1DevDynamic,
];
