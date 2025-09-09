import * as React from 'react';
import { GridRowAriaAttributesInternalHook, GridRowsOverridableMethodsInternalHook } from "./gridRowConfiguration.js";
import type { GridCSSVariablesInterface } from "../../constants/cssVariables.js";
import type { GridRowId } from "../gridRows.js";
import type { GridPrivateApiCommon } from "../api/gridApiCommon.js";
import type { GridPrivateApiCommunity } from "../api/gridApiCommunity.js";
export interface GridAriaAttributesInternalHook {
  useGridAriaAttributes: () => React.HTMLAttributes<HTMLElement>;
}
export interface GridInternalHook<Api> extends GridAriaAttributesInternalHook, GridRowAriaAttributesInternalHook, GridRowsOverridableMethodsInternalHook<Api> {
  useCSSVariables: () => {
    id: string;
    variables: GridCSSVariablesInterface;
  };
  useCellAggregationResult: (id: GridRowId, field: string) => {
    position: 'footer' | 'inline';
    value: any;
  } | null;
}
export interface GridConfiguration<Api extends GridPrivateApiCommon = GridPrivateApiCommunity> {
  hooks: GridInternalHook<Api>;
}