import { gunzip, gzip } from "../deps.ts";
import BinaryReader from "../utils/BinaryReader.ts";
import BinaryWriter from "../utils/BinaryWriter.ts";
import { NBTByte } from "./NBTByte.ts";
import { NBTByteArray } from "./NBTByteArray.ts";
import { NBTCompound } from "./NBTCompound.ts";
import { NBTDouble } from "./NBTDouble.ts";
import { NBTElement } from "./NBTElement.ts";
import { NBTFloat } from "./NBTFloat.ts";
import { NBTInt } from "./NBTInt.ts";
import { NBTIntArray } from "./NBTIntArray.ts";
import { NBTList } from "./NBTList.ts";
import { NBTLong } from "./NBTLong.ts";
import { NBTLongArray } from "./NBTLongArray.ts";
import { NBTNull } from "./NBTNull.ts";
import { NBTShort } from "./NBTShort.ts";
import { NBTString } from "./NBTString.ts";
import { NBTType } from "./NBTType.ts";
import { StringNBTReader } from "./StringNBTReader.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";
import { TreeViewNBTWriter } from "./TreeViewNBTWriter.ts";

export type Format = 'big' | 'little'/*  | 'auto' */
export type WriteOptions = {
  useBedrockLevelHeader: boolean
}

export class NBTUtils {
  private static hasGzipHeader(data: Uint8Array | number[]): boolean {
    if (data[0] !== 0x1f) return false
    if (data[1] !== 0x8b) return false
    return true
  }

  private static hasBedrockLevelHeader(data: Uint8Array | number[]): boolean {
    return data[1] === 0 && data[2] === 0 && data[3] === 0
  }

  public static write(tag: NBTElement, format: Format = 'big', options?: WriteOptions): Uint8Array {
    const writer = new BinaryWriter()
    writer.useLittleEndian(format === 'little' ? true : false)
    
    if (options && options.useBedrockLevelHeader)
      writer.writeBytes([8, 0, 0, 0, 191, 9, 0, 0])
    
    NBTUtils.writeNBT(tag, writer)
    return writer.flush()
  }

  public static writeCompressed(tag: NBTElement, format: Format = 'big', options?: WriteOptions): Uint8Array {
    return gzip(NBTUtils.write(tag, format, options))
  }

  public static read<T extends NBTElement = NBTCompound>(data: Uint8Array | number[], format: Format = 'big'): T {
    const reader = new BinaryReader(data instanceof Uint8Array ? data : new Uint8Array(data), format === 'little' ? true : false)

    if (NBTUtils.hasBedrockLevelHeader(data)) reader.setOffset(8)
    if (NBTUtils.hasGzipHeader(data)) NBTUtils.readCompressed(data, format)

    return NBTUtils.readNBT(reader) as T
  }

  public static readCompressed<T extends NBTElement = NBTCompound>(data: Uint8Array | number[], format: Format = 'big'): T {
    if (!NBTUtils.hasGzipHeader(data)) throw new Error('Data is not compressed')
    const d = gunzip(data instanceof Uint8Array ? data : new Uint8Array(data))
    return NBTUtils.read<T>(d, format)
  }

  private static writeNBT(tag: NBTElement, writer: BinaryWriter): void {
    writer.writeByte(tag.getType())
    if (tag.getType() == 0) return

    writer.writeString('')
    tag.write(writer)
  }

  private static readNBT(reader: BinaryReader): NBTElement {
    const i = reader.readByte()
    if (i === 0) return new NBTNull()

    NBTString.skip(reader)
    return NBTUtils.byId(i).read(reader)
  }

  public static nbtToSNBT(tag: NBTElement, prettify?: boolean, colorType: 'motd' | 'ansi' | 'none' = 'none') {
    return new StringNBTWriter(prettify, (colorType === 'none' ? 0 : colorType === 'motd' ? 1 : 2)).apply(tag)
  }

  public static nbtToTreeView(tag: NBTElement) {
    return new TreeViewNBTWriter().apply(tag)
  }

  public static snbtToNBT(snbt: string) {
    return StringNBTReader.read(snbt)
  }

  public static jnbtToNBT(obj: JObjComp): NBTCompound
  public static jnbtToNBT(obj: JObjList): NBTList
  public static jnbtToNBT(obj: JObjComp | JObjList): NBTCompound | NBTList {
    if (obj.type === 'compound') {
      const comp = new NBTCompound()

      for (const [key, value] of Object.entries(obj.value)) {
        if (value.type === 'byte') comp.putByte(key, value.value)
        else if (value.type === 'short') comp.putShort(key, value.value)
        else if (value.type === 'int') comp.putInt(key, value.value)
        else if (value.type === 'long') comp.putLong(key, value.value)
        else if (value.type === 'float') comp.putFloat(key, value.value)
        else if (value.type === 'double') comp.putDouble(key, value.value)
        else if (value.type === 'string') comp.putString(key, value.value)
        else if (value.type === 'bool') comp.putBoolean(key, value.value)
        else if (value.type === 'byteArray') comp.putByteArray(key, value.value)
        else if (value.type === 'intArray') comp.putIntArray(key, value.value)
        else if (value.type === 'longArray') comp.putLongArray(key, value.value)
        else if (value.type === 'compound') comp.put(key, NBTUtils.jnbtToNBT(value))
        else if (value.type === 'list') comp.put(key, NBTUtils.jnbtToNBT(value))
      }

      return comp
    } else {
      const l: NBTElement[] = []

      for (let i = 0; i < obj.value.value.length; i++) {
        const v = obj.value.value[i]
        if (v.type === 'bool') l.push(NBTByte.of(v.value))
        else if (v.type === 'byte') l.push(NBTByte.of(v.value))
        else if (v.type === 'short') l.push(NBTShort.of(v.value))
        else if (v.type === 'int') l.push(NBTInt.of(v.value))
        else if (v.type === 'long') l.push(NBTLong.of(v.value))
        else if (v.type === 'float') l.push(NBTFloat.of(v.value))
        else if (v.type === 'double') l.push(NBTDouble.of(v.value))
        else if (v.type === 'string') l.push(NBTString.of(v.value))
        else if (v.type === 'byteArray') l.push(new NBTByteArray(v.value))
        else if (v.type === 'intArray') l.push(new NBTIntArray(v.value))
        else if (v.type === 'longArray') l.push(new NBTLongArray(v.value))
        else if (v.type === 'compound') l.push(NBTUtils.jnbtToNBT(v))
        else if (v.type === 'list') l.push(NBTUtils.jnbtToNBT(v as JObjList))
      }

      return new NBTList(l, JTypeId[obj.value.type])
    }
  }

  public static jsnbtToNBT(obj: JSObj): NBTCompound
  public static jsnbtToNBT(obj: JSObjArr): NBTList
  public static jsnbtToNBT(obj: JSObj | JSObjArr): NBTElement {
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      const comp = new NBTCompound()

      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') comp.putString(key, value)
        else if (typeof value === 'number') {
          if (Number.isInteger(value)) comp.putInt(key, value)
          else comp.putFloat(key, value)
        }
        else if (typeof value === 'boolean') comp.putBoolean(key, value)
        else if (typeof value === 'bigint') comp.putLong(key, value)
        else if (typeof value === 'object' && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            if (typeof value[0] === 'bigint') comp.putLongArray(key, value as bigint[])
            else comp.put(key, NBTUtils.jsnbtToNBT(value))
          }
          else comp.put(key, NBTUtils.jsnbtToNBT(value))
        }
      }

      return comp
    } else {
      const list: NBTElement[] = []
      let type: null | number = null

      const checkType = (tagT: number) => {
        if (type === null) type = tagT
        if (type !== null && type !== tagT)
          throw new Error(`Mixed list was found. List must only contain a single NBT type. List type is ${NBTUtils.byId(type).getTreeViewName()} and value type was ${NBTUtils.byId(tagT).getTreeViewName()}`)
      }

      for (const value of obj) {
        if (typeof value === 'string') {
          checkType(8)
          list.push(NBTString.of(value))
        } else if (typeof value === 'number') {
          if (Number.isInteger(value)) {
            checkType(3)
            list.push(NBTInt.of(value))
          }
          else {
            checkType(5)
            list.push(NBTFloat.of(value))
          }
        } else if (typeof value === 'boolean') {
          checkType(1)
          list.push(NBTByte.of(value))
        } else if (typeof value === 'bigint') {
          checkType(4)
          list.push(NBTLong.of(value))
        } else if (typeof value === 'object' && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            if (typeof value[0] === 'bigint') {
              checkType(12)
              list.push(new NBTLongArray(value))
            } else {
              checkType(9)
              list.push(NBTUtils.jsnbtToNBT(value))
            }
          } else {
            checkType(10)
            list.push(NBTUtils.jsnbtToNBT(value))
          }
        }
      }

      return new NBTList(list, type ?? 0)
    }
  }

  public static byId(id: number): NBTType<NBTElement> {
    switch (id) {
      case 0: return NBTNull.TYPE
      case 1: return NBTByte.TYPE
      case 2: return NBTShort.TYPE
      case 3: return NBTInt.TYPE
      case 4: return NBTLong.TYPE
      case 5: return NBTFloat.TYPE
      case 6: return NBTDouble.TYPE
      case 7: return NBTByteArray.TYPE
      case 8: return NBTString.TYPE
      case 9: return NBTList.TYPE
      case 10: return NBTCompound.TYPE
      case 11: return NBTIntArray.TYPE
      case 12: return NBTLongArray.TYPE
      default: throw new RangeError(`There is no NBT Tag of Id ${id}`)
    }
  }

  // Very useless if you ask me
  public static nbtToJSNBT(tag: NBTCompound): JSObj
  public static nbtToJSNBT(tag: NBTList): JSObjArr
  public static nbtToJSNBT(tag: NBTCompound | NBTList): JSObj | JSObjArr {
    if (tag.getType() === 10) {
      tag = tag as NBTCompound
      const obj: JSObj = {}

      const keys = tag.getKeys()

      for (const key of keys) {
        const tV = tag.get(key)
        if (tV.getType() === 1) obj[key] = (tV as NBTByte).numberValue()
        else if (tV.getType() === 2) obj[key] = (tV as NBTShort).numberValue()
        else if (tV.getType() === 3) obj[key] = (tV as NBTInt).numberValue()
        else if (tV.getType() === 4) obj[key] = (tV as NBTLong).longValue()
        else if (tV.getType() === 5) obj[key] = (tV as NBTFloat).longValue()
        else if (tV.getType() === 6) obj[key] = (tV as NBTDouble).longValue()
        else if (tV.getType() === 8) obj[key] = (tV as NBTString).asString()
        else if (tV.getType() === 7) obj[key] = (tV as NBTByteArray).getByteArray()
        else if (tV.getType() === 11) obj[key] = (tV as NBTIntArray).getIntArray()
        else if (tV.getType() === 12) obj[key] = (tV as NBTLongArray).getLongArray()
        else if (tV.getType() === 10) obj[key] = NBTUtils.nbtToJSNBT(tV as NBTCompound)
        else if (tV.getType() === 9) obj[key] = NBTUtils.nbtToJSNBT(tV as NBTList)
      }

      return obj
    } else {
      tag = tag as NBTList
      const arr = []

      for (let i = 0; i < tag.size(); i++) {
        const tV = tag.get(i)
        if (tV.getType() === 1) arr.push((tV as NBTByte).numberValue())
        else if (tV.getType() === 2) arr.push((tV as NBTShort).numberValue())
        else if (tV.getType() === 3) arr.push((tV as NBTInt).numberValue())
        else if (tV.getType() === 4) arr.push((tV as NBTLong).longValue())
        else if (tV.getType() === 5) arr.push((tV as NBTFloat).longValue())
        else if (tV.getType() === 6) arr.push((tV as NBTDouble).longValue())
        else if (tV.getType() === 8) arr.push((tV as NBTString).asString())
        else if (tV.getType() === 7) arr.push((tV as NBTByteArray).getByteArray())
        else if (tV.getType() === 11) arr.push((tV as NBTIntArray).getIntArray())
        else if (tV.getType() === 12) arr.push((tV as NBTLongArray).getLongArray())
        else if (tV.getType() === 10) arr.push(NBTUtils.nbtToJSNBT(tV as NBTCompound))
        else if (tV.getType() === 9) arr.push(NBTUtils.nbtToJSNBT(tV as NBTList))
      }

      return arr as JSObjArr
    }
  }

  public static nbtToJNBT(tag: NBTCompound): JObjComp
  public static nbtToJNBT(tag: NBTList): JObjList
  public static nbtToJNBT(tag: NBTCompound | NBTList): JObjComp | JObjList {
    if (tag.getType() === 10) {
      tag = tag as NBTCompound
      const obj: Record<string, JObj> = {}

      const keys = tag.getKeys()

      for (const key of keys) {
        const tV = tag.get(key)
        if (tV.getType() === 1) obj[key] = JNBT.byte((tV as NBTByte).numberValue())
        else if (tV.getType() === 2) obj[key] = JNBT.short((tV as NBTShort).numberValue())
        else if (tV.getType() === 3) obj[key] = JNBT.int((tV as NBTInt).numberValue())
        else if (tV.getType() === 4) obj[key] = JNBT.long((tV as NBTLong).longValue())
        else if (tV.getType() === 5) obj[key] = JNBT.float((tV as NBTFloat).numberValue())
        else if (tV.getType() === 6) obj[key] = JNBT.double((tV as NBTDouble).numberValue())
        else if (tV.getType() === 8) obj[key] = JNBT.string((tV as NBTString).asString())
        else if (tV.getType() === 9) obj[key] = NBTUtils.nbtToJNBT(tV as NBTList)
        else if (tV.getType() === 10) obj[key] = NBTUtils.nbtToJNBT(tV as NBTCompound)
        else if (tV.getType() === 7) obj[key] = JNBT.byteArray((tV as NBTByteArray).getByteArray())
        else if (tV.getType() === 11) obj[key] = JNBT.intArray((tV as NBTIntArray).getIntArray())
        else if (tV.getType() === 12) obj[key] = JNBT.longArray((tV as NBTLongArray).getLongArray())
      }

      return JNBT.comp(obj)

    } else {
      tag = tag as NBTList
      const arr = []

      for (let i = 0; i < tag.size(); i++) {
        const tV = tag.get(i)
        if (tV.getType() === 1) arr.push(JNBT.byte((tV as NBTByte).numberValue()))
        else if (tV.getType() === 2) arr.push(JNBT.short((tV as NBTShort).numberValue()))
        else if (tV.getType() === 3) arr.push(JNBT.int((tV as NBTInt).numberValue()))
        else if (tV.getType() === 4) arr.push(JNBT.long((tV as NBTLong).longValue()))
        else if (tV.getType() === 5) arr.push(JNBT.float((tV as NBTFloat).numberValue()))
        else if (tV.getType() === 6) arr.push(JNBT.double((tV as NBTDouble).numberValue()))
        else if (tV.getType() === 8) arr.push(JNBT.string((tV as NBTString).asString()))
        else if (tV.getType() === 9) arr.push(NBTUtils.nbtToJNBT(tV as NBTList))
        else if (tV.getType() === 10) arr.push(NBTUtils.nbtToJNBT(tV as NBTCompound))
        else if (tV.getType() === 7) arr.push(JNBT.byteArray((tV as NBTByteArray).getByteArray()))
        else if (tV.getType() === 11) arr.push(JNBT.intArray((tV as NBTIntArray).getIntArray()))
        else if (tV.getType() === 12) arr.push(JNBT.longArray((tV as NBTLongArray).getLongArray()))
      }

      return JNBT.list(arr as JObjArr) as JObjList
    }
  }

  // Useless Shortcuts that you probably will never use
  public static snbtToTreeView(snbt: string): string {
    return NBTUtils.nbtToTreeView(NBTUtils.snbtToNBT(snbt))
  }

  public static jnbtToTreeView(obj: JObjComp): string
  public static jnbtToTreeView(obj: JObjList): string
  public static jnbtToTreeView(obj: JObjList | JObjComp): string {
    if (obj.type === 'compound') return NBTUtils.nbtToTreeView(NBTUtils.jnbtToNBT(obj))
    else return NBTUtils.nbtToTreeView(NBTUtils.jnbtToNBT(obj))
  }

  public static jsnbtToTreeView(obj: JSObj): string
  public static jsnbtToTreeView(obj: JSObjArr): string
  public static jsnbtToTreeView(obj: JSObj | JSObjArr): string {
    if (Array.isArray(obj)) return NBTUtils.nbtToTreeView(NBTUtils.jsnbtToNBT(obj))
    else return NBTUtils.nbtToTreeView(NBTUtils.jsnbtToNBT(obj)) 
  }

  public static snbtToJSNBT(snbt: string): JSObj | JSObjArr {
    return NBTUtils.nbtToJSNBT(NBTUtils.snbtToNBT(snbt))
  }

  public static jnbtToJSNBT(obj: JObjComp): JSObj
  public static jnbtToJSNBT(obj: JObjList): JSObjArr
  public static jnbtToJSNBT(obj: JObjList | JObjComp): JSObj | JSObjArr {
    if (obj.type === 'compound') return NBTUtils.nbtToJSNBT(NBTUtils.jnbtToNBT(obj))
    else return NBTUtils.nbtToJSNBT(NBTUtils.jnbtToNBT(obj)) 
  }

  public static snbtToJNBT(snbt: string): JObjComp | JObjList {
    return NBTUtils.nbtToJNBT(NBTUtils.snbtToNBT(snbt))
  }

  public static jsnbtToJNBT(obj: JSObj): JObjComp
  public static jsnbtToJNBT(obj: JSObjArr): JObjList
  public static jsnbtToJNBT(obj: JSObj | JSObjArr): JObjComp | JObjList {
    if (Array.isArray(obj)) return NBTUtils.nbtToJNBT(NBTUtils.jsnbtToNBT(obj))
    else return NBTUtils.nbtToJNBT(NBTUtils.jsnbtToNBT(obj))
  }
}

const JTypeId: Record<JType, number> = {
  bool: 1,
  byte: 1,
  short: 2,
  int: 3,
  long: 4,
  float: 5,
  double: 6,
  byteArray: 7,
  string: 8,
  list: 9,
  compound: 10,
  intArray: 11,
  longArray: 12,
  end: 0
}

export type JSObjArr = number[] | string[] | bigint[] | boolean[] | JSObj[]
export type JSObjValues = number | string | boolean | bigint | JSObjArr | JSObj
export interface JSObj {
  [key: string]: JSObjValues
}

export type JType = 'byte' | 'short' | 'int' | 'float' | 'long' | 'double' | 'string' | 'bool' | 'byteArray' | 'intArray' | 'end' | 'longArray' | 'list' | 'compound'
export type JObjComp = { type: 'compound', value: Record<string, JObj> }
export type JObjList = { type: 'list', value: { type: JType, value: JObjArr } }
export type JObjArr = 
  { type: 'byte', value: number }[]
  | { type: 'short', value: number }[]
  | { type: 'int', value: number }[]
  | { type: 'long', value: bigint }[]
  | { type: 'float', value: number }[]
  | { type: 'double', value: number }[]
  | { type: 'byteArray', value: number[] }[]
  | { type: 'intArray', value: number[] }[]
  | { type: 'longArray', value: bigint[] }[]
  | { type: 'list', value: number }[]
  | JObjComp[]
  | { type: 'string', value: string }[]
  | { type: 'bool', value: boolean }[]
  | JObjList[]

export type JObj =
    JObjComp
  | { type: 'byte' | 'short' | 'int' | 'float' | 'double', value: number }
  | { type: 'long', value: bigint }
  | { type: 'bool', value: boolean }
  | { type: 'string', value: string }
  | { type: 'byteArray' | 'intArray', value: number[] }
  | { type: 'longArray', value: bigint[] }
  | JObjList

export const JNBT = {
  comp: (obj: Record<string, JObj>): JObjComp => {
    return { type: 'compound', value: obj }
  },
  byte: (value: number): { type: 'byte', value: number } => {
    return { type: 'byte', value: value }
  },
  short: (value: number): { type: 'short', value: number } => {
    return { type: 'short', value: value }
  },
  int: (value: number): JObj => {
    return { type: 'int', value: value }
  },
  long: (value: bigint): JObj => {
    return { type: 'long', value: value }
  },
  float: (value: number): JObj => {
    return { type: 'float', value: value }
  },
  double: (value: number): JObj => {
    return { type: 'double', value: value }
  },
  byteArray: (value: number[]): JObj => {
    return { type: 'byteArray', value: value }
  },
  intArray: (value: number[]): JObj => {
    return { type: 'intArray', value: value }
  },
  longArray: (value: bigint[]): JObj => {
    return { type: 'longArray', value: value }
  },
  list: (value: JObjArr): JObj => {
    return { type: 'list', value: { type: value[0].type, value: value } }
  },
  bool: (value: boolean): JObj => {
    return { type: 'byte', value: value ? 1 : 0 }
  },
  string: (value: string): JObj => {
    return { type: 'string', value: value }
  }
}