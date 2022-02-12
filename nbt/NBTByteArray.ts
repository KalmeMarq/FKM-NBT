import BinaryReader from '../utils/BinaryReader.ts'
import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTByte } from './NBTByte.ts'
import { NBTElement } from './NBTElement.ts'
import { NBTType } from "./NBTType.ts";
import { NBTVisitor } from "./NBTVisitor.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";

export class NBTByteArray extends NBTElement {
  private value: number[]

  public constructor(value: number[]) {
    super()
    this.value = value
  }

  public getType(): number {
    return 7
  }

  public write(writer: BinaryWriter): void {
    writer.writeInt(this.value.length)
    writer.write(this.value)
  }

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitByteArray(this)
  }

  public static TYPE: NBTType<NBTByteArray> = new class extends NBTType<NBTByteArray> {
    public read<NBTByteArray>(reader: BinaryReader): NBTByteArray {
      const l = reader.readInt()
      const arr = new Array(l)
      reader.readFully(arr)
      return new NBTByteArray(arr) as unknown as NBTByteArray
    }
  
    public getTreeViewName(): string {
      return 'TAG_Byte_Array'
    }
  }

  public getNBTType(): NBTType<NBTByteArray> {
    return NBTByteArray.TYPE
  }

  public set(i: number, element: NBTByte): NBTByte {
    const b = this.value[i]
    this.value[i] = element.byteValue()
    return NBTByte.of(b)
  }

  public get(i: number): NBTByte {
    return NBTByte.of(this.value[i])
  }

  public remove(i: number): number {
    return this.value.splice(i)[0]
  }

  public clear(): void {
    this.value.length = 0
  }

  public size(): number {
    return this.value.length
  }
  
  public getByteArray(): number[] {
    return this.value
  }

  public asString(): string {
    return new StringNBTWriter().apply(this)
  }

  /** @deprecated */
  public static reader = {
    read<NBTByteArray>(reader: BinaryReader): NBTByteArray {
      const l = reader.readInt()
      const arr = new Array(l)
      reader.readFully(arr)
      return new NBTByteArray(arr) as unknown as NBTByteArray
    }
  }
}