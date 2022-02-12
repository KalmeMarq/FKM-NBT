import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTInt } from './NBTInt.ts'
import { NBTElement } from './NBTElement.ts'
import BinaryReader from '../utils/BinaryReader.ts'
import { NBTHelper } from './NBTHelper.ts'
import { NBTCompound } from './NBTCompound.ts'
import { NBTShort } from './NBTShort.ts'
import { NBTDouble } from './NBTDouble.ts'
import { NBTFloat } from './NBTFloat.ts'
import { NBTString } from './NBTString.ts'
import { NBTIntArray } from './NBTIntArray.ts'
import { NBTLongArray } from './NBTLongArray.ts'
import { NBTType } from "./NBTType.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";
import { NBTVisitor } from "./NBTVisitor.ts";

export class NBTList extends NBTElement {
  private value: NBTElement[]
  private type: number

  public constructor(value: NBTElement[] = [], type: number = 0) {
    super()
    this.value = value
    this.type = type
  }

  public getType(): number {
    return 9
  }

  public getHeldType(): number {
    return this.type
  }

  public write(writer: BinaryWriter): void {
    this.type = this.value.length < 1 ? 0 : this.value[0].getType()
    writer.writeByte(this.type)
    writer.writeInt(this.value.length)
    for (let i = 0; i < this.value.length; i++) this.value[i].write(writer)
  }

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitList(this)
  }

  public static TYPE: NBTType<NBTList> = new class extends NBTType<NBTList> {
    public read<NBTList>(reader: BinaryReader): NBTList {
      const t = reader.readByte()
      const l = reader.readInt()
      const r = NBTHelper.getById(t)

      const arr = new Array<NBTElement>(l)

      for (let i = 0; i < l; i++) {
        arr[i] = r.read(reader)
      }

      return new NBTList(arr, t) as unknown as NBTList
    }
  
    public getTreeViewName(): string {
      return 'TAG_List'
    }
  }

  public getNBTType(): NBTType<NBTList> {
    return NBTList.TYPE
  }

  public set(i: number, element: NBTElement): NBTElement {
    const b = this.value[i]
    this.value[i] = element
    return b
  }

  public add(element: NBTElement): void {
    this.value.push(element)
  }

  public get(i: number): NBTElement {
    return this.value[i]
  }

  public getCompound(i: number): NBTCompound {
    let el: NBTElement
    if (i >= 0 && i < this.value.length && (el = this.value[i]).getType() === 10) {
      return el as NBTCompound
    }
    return new NBTCompound()
  }

  public getList(i: number): NBTList {
    let el: NBTElement
    if (i >= 0 && i < this.value.length && (el = this.value[i]).getType() === 9) {
      return el as NBTList
    }
    return new NBTList()
  }

  public getShort(i: number): number {
    let el: NBTElement
    if (i >= 0 && i < this.value.length && (el = this.value[i]).getType() === 2) {
      return (el as NBTShort).shortValue()
    }
    return 0
  }

  public getInt(i: number): number {
    let el: NBTElement
    if (i >= 0 && i < this.value.length && (el = this.value[i]).getType() === 3) {
      return (el as NBTInt).intValue()
    }
    return 0
  }
  
  public getIntList(i: number): number[] {
    let el: NBTElement
    if (i >= 0 && i < this.value.length && (el = this.value[i]).getType() === 11) {
      return (el as NBTIntArray).getIntArray()
    }
    return []
  }

  public getLongList(i: number): bigint[] {
    let el: NBTElement
    if (i >= 0 && i < this.value.length && (el = this.value[i]).getType() === 12) {
      return (el as NBTLongArray).getLongArray()
    }
    return []
  }

  public getFloat(i: number): number {
    let el: NBTElement
    if (i >= 0 && i < this.value.length && (el = this.value[i]).getType() === 5) {
      return (el as NBTFloat).floatValue()
    }
    return 0
  }

  public getDouble(i: number): number {
    let el: NBTElement
    if (i >= 0 && i < this.value.length && (el = this.value[i]).getType() === 6) {
      return (el as NBTDouble).doubleValue()
    }
    return 0
  }

  public getString(i: number): string {
    let el: NBTElement
    if (i >= 0 && i < this.value.length && (el = this.value[i]).getType() === 8) {
      return (el as NBTString).asString()
    }
    return ''
  }

  public remove(i: number): NBTElement {
    return this.value.splice(i)[0]
  }

  public clear(): void {
    this.value.length = 0
  }

  public size(): number {
    return this.value.length
  }

  public asString(): string {
    return new StringNBTWriter().apply(this)
  }

  /** @deprecated */
  public static reader = {
    read<NBTList>(reader: BinaryReader): NBTList {
      const t = reader.readByte()
      const l = reader.readInt()
      const r = NBTHelper.getById(t)

      const arr = new Array<NBTElement>(l)

      for (let i = 0; i < l; i++) {
        arr[i] = r.read(reader)
      }

      return new NBTList(arr, t) as unknown as NBTList
    }
  }
}