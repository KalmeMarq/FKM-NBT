import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTInt } from './NBTInt.ts'
import { NBTElement } from './NBTElement.ts'
import BinaryReader from '../utils/BinaryReader.ts'
import { NBTType } from "./NBTType.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";
import { NBTVisitor } from "./NBTVisitor.ts";

export class NBTIntArray extends NBTElement {
  private value: number[]

  public constructor(value: number[]) {
    super()
    this.value = value
  }

  public getType(): number {
    return 11
  }

  public write(writer: BinaryWriter): void {
    writer.writeInt(this.value.length)
    for (let i = 0; i < this.value.length; i++) writer.writeInt(this.value[i])
  }

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitIntArray(this)
  }

  public static TYPE: NBTType<NBTIntArray> = new class extends NBTType<NBTIntArray> {
    public read<NBTIntArray>(reader: BinaryReader): NBTIntArray {
      const l = reader.readInt()
      const arr = new Array(l)
      reader.readFully(arr)
      return new NBTIntArray(arr) as unknown as NBTIntArray
    }
  
    public getTreeViewName(): string {
      return 'TAG_Int_Array'
    }
  }

  public getNBTType(): NBTType<NBTIntArray> {
    return NBTIntArray.TYPE
  }

  public set(i: number, element: NBTInt): NBTInt {
    const b = this.value[i]
    this.value[i] = element.intValue()
    return NBTInt.of(b)
  }

  public get(i: number): NBTInt {
    return NBTInt.of(this.value[i])
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
  
  public getIntArray(): number[] {
    return this.value
  }

  public asString(): string {
    return new StringNBTWriter().apply(this)
  }

  /** @deprecated */
  public static reader = {
    read<NBTIntArray>(reader: BinaryReader): NBTIntArray {
      const l = reader.readInt()
      const arr = new Array(l)
      for (let i = 0; i < l; i++) {
        arr[i] = reader.readInt()
      }

      return new NBTIntArray(arr) as unknown as NBTIntArray
    }
  }
}