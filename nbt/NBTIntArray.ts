import BinaryWriter from "../BinaryWriter.ts";
import { NBTInt } from "./NBTInt.ts";
import { NBTElement } from "./NBTElement.ts";
import BinaryReader from "../BinaryReader.ts";

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
}