import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTLong } from './NBTLong.ts'
import { NBTElement } from './NBTElement.ts'
import BinaryReader from '../utils/BinaryReader.ts'
import { NBTType } from "./NBTType.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";
import { NBTVisitor } from "./NBTVisitor.ts";

export class NBTLongArray extends NBTElement {
  private value: bigint[]

  public constructor(value: bigint[]) {
    super()
    this.value = value
  }

  public getType(): number {
    return 12
  }

  public write(writer: BinaryWriter): void {
    writer.writeInt(this.value.length)
    for (let i = 0; i < this.value.length; i++) writer.writeLong(this.value[i])
  }

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitLongArray(this)
  }

  public static TYPE: NBTType<NBTLongArray> = new class extends NBTType<NBTLongArray> {
    public read<NBTLongArray>(reader: BinaryReader): NBTLongArray {
      const l = reader.readInt()
      const arr = new Array(l)
      reader.readFully(arr)
      return new NBTLongArray(arr) as unknown as NBTLongArray
    }
  
    public getTreeViewName(): string {
      return 'TAG_Long_Array'
    }
  }

  public getNBTType(): NBTType<NBTLongArray> {
    return NBTLongArray.TYPE
  }

  public set(i: number, element: NBTLong): NBTLong {
    const b = this.value[i]
    this.value[i] = element.longValue()
    return NBTLong.of(b)
  }

  public get(i: number): NBTLong {
    return NBTLong.of(this.value[i])
  }

  public remove(i: number): bigint {
    return this.value.splice(i)[0]
  }

  public clear(): void {
    this.value.length = 0
  }

  public size(): number {
    return this.value.length
  }
  
  public getLongArray(): bigint[] {
    return this.value
  }

  public asString(): string {
    return new StringNBTWriter().apply(this)
  }

  /** @deprecated */
  public static reader = {
    read<NBTLongArray>(reader: BinaryReader): NBTLongArray {
      const l = reader.readInt()
      const arr = new Array(l)
      for (let i = 0; i < l; i++) {
        arr[i] = reader.readLong()
      }

      return new NBTLongArray(arr) as unknown as NBTLongArray
    }
  }
}