import BinaryReader from '../BinaryReader.ts'
import BinaryWriter from '../BinaryWriter.ts'
import { NBTByte } from './NBTByte.ts'
import { NBTByteArray } from './NBTByteArray.ts'
import { NBTCompound } from './NBTCompound.ts'
import { NBTDouble } from './NBTDouble.ts'
import { NBTElement } from './NBTElement.ts'
import { NBTFloat } from './NBTFloat.ts'
import { NBTInt } from './NBTInt.ts'
import { NBTIntArray } from './NBTIntArray.ts'
import { NBTList } from './NBTList.ts'
import { NBTLong } from './NBTLong.ts'
import { NBTLongArray } from './NBTLongArray.ts'
import { NBTNull } from './NBTNull.ts'
import { NBTShort } from './NBTShort.ts'
import { NBTString } from './NBTString.ts'
import { gzip, gunzip } from 'https://deno.land/x/compress@v0.4.1/mod.ts'
import { StringNBTReader } from "./StringNBTReader.ts";

export class NBTHelper {
  private constructor() {}

  public static write(element: NBTElement, littleEndian?: boolean, bedrockHeader?: boolean): Uint8Array {
    const writer = new BinaryWriter()
    writer.useLittleEndian(littleEndian ?? false)
    if (bedrockHeader) {
      writer.writeBytes([8, 0, 0, 0, 191, 9, 0, 0])
    }
    this.writeNBT(element as NBTElement, writer)
    return writer.flush()
  }

  public static writeCompressed(element: NBTElement, littleEndian?: boolean, bedrockHeader?: boolean): Uint8Array {
    return gzip(this.write(element, littleEndian, bedrockHeader))
  }

  public static read<T = NBTCompound>(data: Uint8Array): T {
    let b = false
    let off = 0
    if (data[1] === 0 && data[2] === 0 && data[3] === 0) {
      b = true
      off = 8
    }

    const reader = new BinaryReader(data, b)
    reader.setOffset(off)
    return NBTHelper.readNBT(reader) as unknown as T
  }

  public static readCompressed<T = NBTCompound>(data: Uint8Array): T {
    const d = gunzip(data)
    const reader = new BinaryReader(d)
    return NBTHelper.readNBT(reader) as unknown as T
  }

  private static writeNBT(element: NBTElement, writer: BinaryWriter): void {
    writer.writeByte(element.getType())
    if (element.getType() == 0) {
        return;
    }
    writer.writeString('')
    element.write(writer)
  }

  private static readNBT(reader: BinaryReader): NBTElement {
    const i = reader.readByte()
    if (i === 0) return new NBTNull()

    NBTString.skip(reader)

    return NBTHelper.getById(i).read(reader)
  }

  public static getById(id: number) {
    switch (id) {
      case 0:
        return NBTNull.reader
      case 1:
        return NBTByte.reader
      case 2:
        return NBTShort.reader
      case 3:
        return NBTInt.reader
      case 4:
        return NBTLong.reader
      case 5:
        return NBTFloat.reader
      case 6:
        return NBTDouble.reader
      case 7:
        return NBTByteArray.reader
      case 8:
        return NBTString.reader
      case 9:
        return NBTList.reader
      case 10:
        return NBTCompound.reader
      case 11:
        return NBTIntArray.reader
      case 12:
        return NBTLongArray.reader
      default:
        throw new Error('Tag does not exist')
    }
  }

  public static nameToId(name: nameEL) {
    switch (name) {
      case 'byte':
        return 1
      case 'short':
        return 2
      case 'int':
        return 3
      case 'long':
        return 4
      case 'float':
        return 5
      case 'double':
        return 6
      case 'byte_array':
        return 7
      case 'string':
        return 8
      case 'list':
        return 9
      case 'compound':
        return 10
      case 'int_array':
        return 11
      case 'long_array':
        return 12
    }
  }

  public static idToName(id: idEL) {
    switch (id) {
      case 1:
        return 'byte'
      case 2:
        return 'short'
      case 3:
        return 'int'
      case 4:
        return 'long'
      case 5:
        return 'float'
      case 6:
        return 'double'
      case 7:
        return 'byte_array'
      case 8:
        return 'string'
      case 9:
        return 'list'
      case 10:
        return 'compound'
      case 11:
        return 'int_array'
      case 12:
        return 'long_array'
    }
  }

  public static snbtToNBT(text: string): NBTCompound {
    return StringNBTReader.read(text)
  }

  public static nbtToJNBT(compound: NBTCompound) {
    const root: JObj = { type: 'compound', value: {} }

    const keys = compound.getKeys()

    for (const key of keys) {
      const el = compound.get(key)
    
      switch (el.getType()) {
        case 1:
          root.value[key] = JNBT.byte((el as NBTByte).byteValue())
          break;
        case 2:
          root.value[key] = JNBT.short((el as NBTShort).shortValue())
          break;
        case 3:
          root.value[key] = JNBT.int((el as NBTInt).intValue())
          break;
        case 4:
          root.value[key] = JNBT.long((el as NBTLong).longValue())
          break;
        case 5:
          root.value[key] = JNBT.float((el as NBTFloat).floatValue())
          break;
        case 6:
          root.value[key] = JNBT.double((el as NBTDouble).doubleValue())
          break;
        case 7:
          root.value[key] = JNBT.byteArray((el as NBTByteArray).getByteArray())
          break;
        case 8:
          root.value[key] = JNBT.string((el as NBTString).asString())
          break;
        case 10:
          root.value[key] = this.nbtToJNBT(el as NBTCompound)
          break;
        case 11:
          root.value[key] = JNBT.intArray((el as NBTIntArray).getIntArray())
          break;
        case 12:
          root.value[key] = JNBT.longArray((el as NBTLongArray).getLongArray())
          break;
      }
    }

    return root
  }

  public static nbtToJSNBT(compound: NBTCompound) {
    const obj: Record<string, any> = {}

    const keys = compound.getKeys()

    for (const key of keys) {
      const el = compound.get(key)

      switch (el.getType()) {
        case 1:
          obj[key] = (el as NBTByte).byteValue()
          break;
        case 2:
          obj[key] = (el as NBTShort).shortValue()
          break;
        case 3:
          obj[key] = (el as NBTInt).intValue()
          break;
        case 4:
          obj[key] = (el as NBTLong).longValue()
          break;
        case 5:
          obj[key] = (el as NBTFloat).floatValue()
          break;
        case 6:
          obj[key] = (el as NBTDouble).doubleValue()
          break;
        case 7:
          obj[key] = (el as NBTByteArray).getByteArray()
          break;
        case 8:
          obj[key] = (el as NBTString).asString()
          break;
        case 10:
          obj[key] = this.nbtToJSNBT(el as NBTCompound)
          break;
        case 11:
          obj[key] = (el as NBTIntArray).getIntArray()
          break;
        case 12:
          obj[key] = (el as NBTLongArray).getLongArray()
          break;
      }
    }

    return obj
  }

  public static nbtToSNBT(compound: NBTCompound) {
    let str = '{'

    const keys = compound.getKeys()

    let j = 0;
    for (const key of keys) {
      const el = compound.get(key)

      switch (el.getType()) {
        case 1:
          str += `${key.includes(' ') ? `"${key}"` : key}:${(el as NBTByte).byteValue()}b`
          break;
        case 2:
          str += `${key.includes(' ') ? `"${key}"` : key}:${(el as NBTShort).shortValue()}s`
          break;
        case 3:
          str += `${key.includes(' ') ? `"${key}"` : key}:${(el as NBTInt).shortValue()}`
          break;
        case 4:
          str += `${key.includes(' ') ? `"${key}"` : key}:${(el as NBTLong).longValue()}L`
          break;
        case 5:
          str += `${key.includes(' ') ? `"${key}"` : key}:${(el as NBTFloat).floatValue()}f`
          break;
        case 6:
          str += `${key.includes(' ') ? `"${key}"` : key}:${(el as NBTDouble).doubleValue()}d`
          break;
        case 7:
          str += `${key.includes(' ') ? `"${key}"` : key}:[`
          const l = (el as NBTByteArray).getByteArray()

          for (let i = 0; i < l.length; i++) {
            str += l[i] + 'b'
            
            if (i + 1 < l.length) {
              str += ','
            }
          }

          str += ']'
          break;
        case 8:
          str += `${key.includes(' ') ? `"${key}"` : key}:"${(el as NBTString).asString()}"`
          break;
        case 10:
          str += `${key.includes(' ') ? `"${key}"` : key}:${this.nbtToSNBT(el as NBTCompound)}`
          break;
      }

      if (j + 1 < keys.length) {
        str += ','
      }

      j++;
    }

    str += '}'
    return str
  }

  public static jnbtToNBT<T = NBTElement>(obj: JObj): T {
    if (obj.type === 'list') {
      const arr: NBTElement[] = []
      const t = obj.value[0].type

      for (let i = 0; i < obj.value.length; i++) {
        const v = obj.value[i]
        if (v.type === t) {
          switch (v.type) {
            case 'byte':
              arr.push(NBTByte.of(v.value))
              break;
            case 'short':
              arr.push(NBTShort.of(v.value))
              break;
            case 'int':
              arr.push(NBTInt.of(v.value))
              break;
            case 'long':
              arr.push(NBTLong.of(v.value))
              break;
            case 'float':
              arr.push(NBTFloat.of(v.value))
              break;
            case 'double':
              arr.push(NBTDouble.of(v.value))
              break;
            case 'string':
              arr.push(NBTString.of(v.value))
              break;
            case 'byte_array':
              arr.push(new NBTByteArray(v.value))
              break;
            case 'int_array':
              arr.push(new NBTIntArray(v.value))
              break;
            case 'long_array':
              arr.push(new NBTLongArray(v.value))
              break;
            case 'compound':
              arr.push(NBTHelper.jnbtToNBT(v))
              break;
            case 'list':
              arr.push(NBTHelper.jnbtToNBT(v))
              break;
          }
        } else {
          throw new Error('List items should have all the same nbt type')
        }
      }

      return new NBTList(arr, NBTHelper.nameToId(t)) as any
    } else if (obj.type === 'compound') {
      const root = new NBTCompound()
      Object.entries(obj.value).forEach(([k, v]) => {
        switch (v.type) {
          case 'compound':
            root.put(k, new NBTCompound(NBTHelper.jnbtToNBT(v)))
            break;
          case 'byte':
            root.putByte(k, v.value)
            break;
          case 'short':
            root.putShort(k, v.value)
            break;
          case 'int':
            root.putInt(k, v.value)
            break;
          case 'long':
            root.putLong(k, v.value)
            break;
          case 'float':
            root.putFloat(k, v.value)
            break;
          case 'double':
            root.putDouble(k, v.value)
            break;
          case 'string':
            root.putString(k, v.value)
            break;
          case 'byte_array':
            root.putByteArray(k, v.value)
            break;
          case 'int_array':
            root.putIntArray(k, v.value)
            break;
          case 'long_array':
            root.putLongArray(k, v.value)
            break;
          case 'list':
            root.put(k, NBTHelper.jnbtToNBT(v))
            break;
        }
      })
      return root as any
    } else {
      throw '[ERROR] Root type should be a compound'
    }
  }

  public static jsnbtToNBT<T = NBTElement>(json: any): T {
    if (typeof json === 'object' && Array.isArray(json)) {
      const arr: any[] = []

      let t: number = 0
      const v = json[0]

      if (typeof v === 'string') {
        t = 8
      } else if (typeof v === 'number') {
        if (Number.isInteger(v)) {
          t = 3
        } else {
          t = 5
        }
      } else if (typeof v === 'bigint') {
        t = 4
      } else if (typeof v === 'object') {
        if (Array.isArray(v)) {
          t = 9
        } else {
          t = 10
        }
      }

      for (let i = 0; i < json.length; i++) {
        if (typeof json[i] === 'string') {
          arr.push(NBTString.of(json[i]))
        } else if (typeof json[i] === 'bigint') {
          arr.push(NBTLong.of(json[i]))
        } else if (typeof json[i] === 'number') {
          if (Number.isInteger(json[i])) arr.push(NBTInt.of(json[i]))
          else arr.push(NBTFloat.of(json[i]))
        } else if (typeof json[i] === 'object') {
          arr.push(NBTHelper.jsnbtToNBT(json[i]))
        }
      }

      if (t === 4) {
        return new NBTLongArray(arr) as any
      } else if (t === 3) {
        return new NBTIntArray(arr) as any
      } else {
        return new NBTList(arr, t) as any
      }
    } else if (typeof json === 'object' && !Array.isArray(json)) {
      const root = new NBTCompound()
      Object.entries(json).forEach(([k, v]) => {
        switch (typeof v) {
          case 'object':
            if (!Array.isArray(v)) {
              root.put(k, NBTHelper.jsnbtToNBT(v))
            } else if (v !== null) {
              root.put(k, NBTHelper.jsnbtToNBT(v))
            }
            break;
          case 'bigint':
            root.putLong(k, v)
            break;
          case 'string':
            root.putString(k, v)
            break;
          case 'number':
            if (Number.isInteger(v)) {
              root.putInt(k, v)
            } else {
              root.putFloat(k, v)
            }
            break;
          case 'boolean':
            root.putBoolean(k, v)
            break;
        }
      })
      return root as any
    } else {
      return new NBTCompound() as any
    }
  }
}

export type idEL = 10 | 9 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 11 | 12
export type nameEL = 'compound' | 'list' | 'byte' | 'short' | 'int' | 'long' | 'float' | 'double' | 'string' | 'byte_array' | 'int_array' | 'long_array'

export type JObj =
    { type: 'compound', value: JCompObj } |
    { type: 'byte' | 'short' | 'int' | 'float' | 'double', value: number } |
    { type: 'string', value: string } |
    { type: 'long', value: bigint } |
    { type: 'byte_array' | 'int_array', value: number[] } |
    { type: 'long_array', value: bigint[] } |
    { type: 'list', value: JObj[] }

export type JCompObj = Record<string, JObj>
export type JSObj = { [key: string]: number | string | bigint | JSObj }

export const JNBT = {
    comp: (obj: JCompObj): JObj => {
      return { type: 'compound', value: obj }
    },
    byte: (value: number): JObj => {
      return { type: 'byte', value: value }
    },
    short: (value: number): JObj => {
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
      return { type: 'byte_array', value: value }
    },
    intArray: (value: number[]): JObj => {
      return { type: 'int_array', value: value }
    },
    longArray: (value: bigint[]): JObj => {
      return { type: 'long_array', value: value }
    },
    list: (value: JObj[]): JObj => {
      return { type: 'list', value: value }
    },
    boolean: (value: boolean): JObj => {
        return { type: 'byte', value: value ? 0 : 1 }
    },
    string: (value: string): JObj => {
        return { type: 'string', value: value }
    }
}