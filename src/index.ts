import NumberFormatBase from './number_format_base';
import NumericFormat from './numeric_format';
import PatternFormat from './pattern_format';
import {
  format as numericFormatter,
  removeFormatting as removeNumericFormat,
  getCaretBoundary as getNumericCaretBoundary,
  useNumericFormat,
} from './numeric_format';

import {
  format as patternFormatter,
  removeFormatting as removePatternFormat,
  getCaretBoundary as getPatternCaretBoundary,
  usePatternFormat,
} from './pattern_format';

export { NumberFormatBase, NumericFormat, PatternFormat };

export type {
  NumericFormatProps,
  NumberFormatBaseProps,
  PatternFormatProps,
  SourceInfo,
  SourceType,
  NumberFormatValues,
  OnValueChange,
  InputAttributes,
  ChangeMeta,
} from './types';

export { numericFormatter, removeNumericFormat, getNumericCaretBoundary, useNumericFormat };
export { patternFormatter, removePatternFormat, getPatternCaretBoundary, usePatternFormat };
