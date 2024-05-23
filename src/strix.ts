import type { AnyKey, AnyStringish, GetPathValue, GetPaths, InterpolationVariable, Join, Override, Split } from '@recon-struct/utility-types'
import type { AnyObject } from '@recon-struct/utility-types/dist/any/any-object'
import type { AnyPrimitive } from '@recon-struct/utility-types/dist/any/any-primitive'
import type { HelperCaptureGroup } from '@recon-struct/utility-types/dist/helper/capture-group'
import { interpolate, getDeepProp } from '@recon-struct/utils'

/**
 * Represents a deep object type.
 * @typeParam A - The object type.
 */
export interface TemplateManifest {
  [key: AnyKey]: TemplateManifest | AnyStringish
}

export type DefaultCaptureGroup = HelperCaptureGroup<'{{', '}}'>

export type DefaultSeparator = '.'

/**
 * Extracts captured groups from a string based on a specified capture group pattern.
 *
 * @typeParam A - The input string type.
 * @typeParam B - The capture group pattern type.
 * @typeParam C - The accumulated captured groups type.
 * @param {A} input - The input string.
 * @returns {C} - The accumulated captured groups.
 */
export type Capture<
  A extends TemplateManifest | AnyPrimitive,
  B extends HelperCaptureGroup = DefaultCaptureGroup,
  C extends string = never,
> = A extends `${string}${B['start']}${infer D}${B['end']}${infer E}`
  ? Capture<E, B, C | D>
  : C

/**
 * Represents an interpolation type.
 *
 * @typeParam A - The type of the object being interpolated.
 * @typeParam B - The type of the capture group.
 * @typeParam C - The type of the object with captured values.
 * @typeParam D - The type of the object being interpolated (default: A).
 * @typeParam E - The type of the captured value.
 */
export type Interpolation<
  A extends TemplateManifest | AnyPrimitive,
  B extends HelperCaptureGroup = DefaultCaptureGroup,
  C extends AnyObject<Capture<A, B>, InterpolationVariable> = AnyObject<Capture<A, B>, InterpolationVariable>,
  D extends TemplateManifest | AnyPrimitive = A,
  E extends Capture<A, B> = Capture<A, B>,
> = D extends `${infer F}${B['start']}${infer G}${B['end']}${infer H}`
  ? G extends E
    ? Interpolation<A, B, C, `${F}${C[G]}${H}`, E>
    : never
  : D

interface StrixOptions<A extends HelperCaptureGroup = HelperCaptureGroup, B extends string = string>{
  captureGroup?: A
  separator?: B
}

const DEFAULT_CAPTURE_GROUP: DefaultCaptureGroup = {
  start: '{{',
  end: '}}',
}

const DEFAULT_SEPARATOR: DefaultSeparator = '.'

type DefaultOptions = StrixOptions<DefaultCaptureGroup, DefaultSeparator>

const DEFAULT_OPTIONS: DefaultOptions= {
  captureGroup: DEFAULT_CAPTURE_GROUP,
  separator: DEFAULT_SEPARATOR,
}

/**
 * Creates a template function that allows for dynamic interpolation of
 * templates.
 *
 * @typeParam A - The type of the templates object.
 * @typeParam B - The type of the capture group.
 * @param {A} templates - The object containing the templates.
 * @param {B} captureGroup - The capture group to use for interpolation.
 *        Defaults to DEFAULT_CAPTURE_GROUP.
 * @returns {templateFunction} - The template function.
 */
const strix = <
  A extends TemplateManifest,
  B extends HelperCaptureGroup = DefaultCaptureGroup,
  C extends string = DefaultSeparator,
>(
  templates: A,
  _options?: StrixOptions<B, C>
) => {
  const options = { ...DEFAULT_OPTIONS, ..._options, } as Override<DefaultOptions, StrixOptions<B, C>>

  /**
   * Return a curried function that takes a `key` defined in `templates` and
   * an object containing the variables defined for that function.
   * @param key
   * @param variables
   * @returns
   */
  const templateFunction = <
    D extends Join<GetPaths<A>, C>,
    E extends AnyObject<Capture<GetPathValue<A, Split<D, C>>, B>, InterpolationVariable>,
  >(
    key: D,
    ...params: Capture<GetPathValue<A, Split<D, C>>, B> extends never ? [] : [E]
  ): Interpolation<GetPathValue<A, Split<D, C>>, B, E> => {
    const variables = params[0] ?? {}
    const template = getDeepProp(templates, key, options.separator as C)


    return interpolate(
      template as string,
      options.captureGroup as B,
      variables,
    ) as Interpolation<GetPathValue<A, Split<D, C>>, B, E>
  }

  return templateFunction
}

export default strix
