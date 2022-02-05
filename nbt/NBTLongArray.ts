import BinaryWriter from "../BinaryWriter.ts";
import { NBTLong } from "./NBTLong.ts";
import { NBTElement } from "./NBTElement.ts";
import BinaryReader from "../BinaryReader.ts";

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
}