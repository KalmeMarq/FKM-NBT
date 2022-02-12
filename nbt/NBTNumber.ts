import { NBTElement } from "./NBTElement.ts";

export abstract class NBTNumber extends NBTElement {
  abstract byteValue(): number
  abstract shortValue(): number
  abstract intValue(): number
  abstract longValue(): bigint
  abstract floatValue(): number
  abstract doubleValue(): number
  abstract numberValue(): number
}