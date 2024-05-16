import type { AnyObject } from '@recon-struct/utility-types/dist/any/any-object'
import type { AnyPrimitive } from '@recon-struct/utility-types/dist/any/any-primitive'
import type {
  DeepObject,
  GetKeys,
} from '@recon-struct/utility-types/dist/object/get-keys'
import type { GetValue } from '@recon-struct/utility-types/dist/object/get-value'
import { interpolate, getDeepProp } from '@recon-struct/utils'

export type DefaultCaputreGroup = { start: '{{', end: '}}' }

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
  A extends DeepObject | AnyPrimitive,
  B extends { start: string, end: string } = DefaultCaputreGroup,
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
  A extends DeepObject | AnyPrimitive,
  B extends { start: string, end: string } = DefaultCaputreGroup,
  C extends AnyObject<Capture<A, B>, string> = AnyObject<Capture<A, B>, string>,
  D extends DeepObject | AnyPrimitive = A,
  E extends Capture<A, B> = Capture<A, B>,
> = D extends `${infer F}${B['start']}${infer G}${B['end']}${infer H}`
  ? G extends E
    ? Interpolation<A, B, C, `${F}${C[G]}${H}`, E>
    : never
  : D

const DEFAULT_CAPTURE_GROUP: DefaultCaputreGroup = {
  start: '{{',
  end: '}}',
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
  A extends DeepObject,
  B extends { start: string, end: string } = DefaultCaputreGroup,
>(
  templates: A,
  captureGroup: B = DEFAULT_CAPTURE_GROUP as B,
) => {
  /**
   * Return a curried function that takes a `key` defined in `templates` and
   * an object containing the variables defined for that function.
   * @param key
   * @param variables
   * @returns
   */
  const templateFunction = <
    C extends GetKeys<A>,
    D extends AnyObject<Capture<GetValue<A, C>, B>, string>,
  >(
    key: C,
    ...params: Capture<GetValue<A, C>, B> extends never ? [] : [D]
  ): Interpolation<GetValue<A, C>, B, D> => {
    const variables = params[0] ?? {}
    const template = getDeepProp(templates, key)

    return interpolate(
      template as string,
      captureGroup,
      variables,
    ) as Interpolation<GetValue<A, C>, B, D>
  }

  return templateFunction
}

export default strix
