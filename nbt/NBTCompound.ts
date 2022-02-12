import BinaryReader from '../utils/BinaryReader.ts'
import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTByte } from './NBTByte.ts'
import { NBTByteArray } from './NBTByteArray.ts'
import { NBTDouble } from './NBTDouble.ts'
import { NBTElement } from './NBTElement.ts'
import { NBTFloat } from './NBTFloat.ts'
import { NBTHelper } from './NBTHelper.ts'
import { NBTInt } from './NBTInt.ts'
import { NBTIntArray } from './NBTIntArray.ts'
import { NBTList } from './NBTList.ts'
import { NBTLong } from './NBTLong.ts'
import { NBTLongArray } from './NBTLongArray.ts'
import { NBTShort } from './NBTShort.ts'
import { NBTString } from './NBTString.ts'
import { NBTType } from "./NBTType.ts";
import { NBTVisitor } from "./NBTVisitor.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";

export class NBTCompound extends NBTElement {
  private entries: Record<string, NBTElement>

  public constructor(entries?: Record<string, NBTElement> | Map<string, NBTElement>) {
      super()
      this.entries = {}
      if (entries instanceof Map) {
          for (const [k, v] of entries.entries()) {
              this.entries[k] = v
          }
      } else if (entries) {
          this.entries = entries
      }
  }

  public override getType(): number {
    return 10
  }

  public write(writer: BinaryWriter): void {
    const keys = Object.keys(this.entries)
    for (let i = 0; i < keys.length; i++) {
      const el = this.entries[keys[i]]

      try {
        writer.writeByte(el.getType())
        if (el.getType() == 0) {
            return
        }
        writer.writeString(keys[i])
        el.write(writer)
      } catch(e) {}

    }
    
    writer.writeByte(0)
  }

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitCompound(this)
  }

  public static TYPE: NBTType<NBTCompound> = new class extends NBTType<NBTCompound> {
    public read<NBTCompound>(reader: BinaryReader): NBTCompound {
      let b = 0;
      let entries: Record<string, NBTElement> = {}

      while ((b = reader.readByte()) !== 0) {
        const name = reader.readString()
        const el = NBTHelper.getById(b).read(reader) as NBTElement
        if (el) entries[name] = el
      }

      return new NBTCompound(entries) as unknown as NBTCompound
    }
  
    public getTreeViewName(): string {
      return 'TAG_Compound'
    }
  }

  public getNBTType(): NBTType<NBTCompound> {
    return NBTCompound.TYPE
  }

  public put(key: string, element: NBTElement): void {
      this.entries[key] = element
  }

  public putString(key: string, value: string): void {
      this.entries[key] = NBTString.of(value)
  }

  public putByte(key: string, value: number): void {
      this.entries[key] = NBTByte.of(value)
  }

  public putByteArray(key: string, value: number[]) {
    this.entries[key] = new NBTByteArray(value)
  }

  public putShort(key: string, value: number): void {
    this.entries[key] = NBTShort.of(value)
  }

  public putInt(key: string, value: number): void {
    this.entries[key] = NBTInt.of(value)
  }

  public putIntArray(key: string, value: number[]) {
    this.entries[key] = new NBTIntArray(value)
  }

  public putLong(key: string, value: bigint): void {
    this.entries[key] = NBTLong.of(value)
  }

  public putLongArray(key: string, value: bigint[]) {
    this.entries[key] = new NBTLongArray(value)
  }

  public putFloat(key: string, value: number): void {
    this.entries[key] = NBTFloat.of(value)
  }

  public putDouble(key: string, value: number): void {
    this.entries[key] = NBTDouble.of(value)
  }

  public putBoolean(key: string, value: boolean): void {
      this.entries[key] = NBTByte.of(value)
  }

  public get(key: string): NBTElement {
    return this.entries[key]
  }

  public getElementType(key: string): number {
    const el = this.entries[key]
    if (el) return el.getType()
    return 0
  }

  public getKeys(): string[] {
    return Object.keys(this.entries)
  }

  public contains(key: string, type?: number): boolean {
    if (type) {
      const i = this.getElementType(key)
      if (i === type) return true
      else if (type === 69) {
        return i == 1 || i == 2 || i == 3 || i == 4 || i == 5 || i == 6
      }
    }

    return this.entries[key] !== undefined && this.entries[key] !== null
  }

  public getByte(key: string): number {
    if (this.contains(key, 69)) {
      return (this.entries[key] as NBTByte).byteValue()
    }
    return 0
  }

  public getShort(key: string): number {
    if (this.contains(key, 69)) {
      return (this.entries[key] as NBTShort).shortValue()
    }
    return 0
  }

  public getInt(key: string): number {
    if (this.contains(key, 69)) {
      return (this.entries[key] as NBTByte).intValue()
    }
    return 0
  }

  public getLong(key: string): bigint {
    if (this.contains(key, 69)) {
      return (this.entries[key] as NBTLong).longValue()
    }
    return 0n
  }

  public getFloat(key: string): number {
    if (this.contains(key, 69)) {
      return (this.entries[key] as NBTFloat).byteValue()
    }
    return 0
  }

  public getDouble(key: string): number {
    if (this.contains(key, 69)) {
      return (this.entries[key] as NBTDouble).byteValue()
    }
    return 0
  }

  public getBoolean(key: string): boolean {
    return this.getByte(key) !== 0
  }

  public getString(key: string): string {
    if (this.contains(key, 8)) {
      return (this.entries[key] as NBTString).asString()
    }
    return ''
  }

  public getCompound(key: string): NBTCompound {
    if (this.contains(key, 10)) {
      return this.entries[key] as NBTCompound
    }
    return new NBTCompound()
  }

  public getByteArray(key: string): number[] {
    if (this.contains(key, 7)) {
      return (this.entries[key] as NBTByteArray).getByteArray()
    }
    return []
  }

  public getIntArray(key: string): number[] {
    if (this.contains(key, 11)) {
      return (this.entries[key] as NBTIntArray).getIntArray()
    }
    return []
  }

  public getLongArray(key: string): bigint[] {
    if (this.contains(key, 12)) {
      return (this.entries[key] as NBTLongArray).getLongArray()
    }
    return []
  }

  public getList(key: string, type: number): NBTList {
    if (this.getElementType(key) === 9) {
      const list = this.entries[key] as NBTList
      if (list.size() < 1 || list.getHeldType() === type) {
        return list
      } else {
        return new NBTList()
      }
    }

    return new NBTList()
  }

  public remove(key: string): void {
    delete this.entries[key]
  }

  public asString(): string {
    return new StringNBTWriter().apply(this)
  }

  /** @deprecated */
  public static reader = {
    read<NBTCompound>(reader: BinaryReader): NBTCompound {
      let b = 0;
      let entries: Record<string, NBTElement> = {}

      while ((b = reader.readByte()) !== 0) {
        const name = reader.readString()
        const el = NBTHelper.getById(b).read(reader) as NBTElement
        if (el) entries[name] = el
      }

      return new NBTCompound(entries) as unknown as NBTCompound
    }
  }
}