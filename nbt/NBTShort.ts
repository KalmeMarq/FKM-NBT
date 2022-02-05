import BinaryReader from "../BinaryReader.ts";
import BinaryWriter from "../BinaryWriter.ts";
import { NBTElement } from "./NBTElement.ts";
import { NBTTypeReader } from "./NBTTypeReader.ts";

export class NBTShort extends NBTElement {
  private value: number

  public constructor(value?: number) {
      super()
      this.value = value ?? 0
  }

  public static of(value: number): NBTShort {
    return new NBTShort(value)
  }

  public override getType(): number {
    return 2
  }

  public write(writer: BinaryWriter): void {
    writer.writeShort(this.value)
  }

  public static reader = {
    read<NBTShort>(reader: BinaryReader): NBTShort {
      return NBTShort.of(reader.readShort()) as unknown as NBTShort
    }
  }
  
  public byteValue(): number {
    return this.value & 0xFF
  }

  public shortValue(): number {
    return this.value
  }

  public intValue(): number {
    return this.value
  }

  public floatValue(): number {
    return this.value
  }

  public doubleValue(): number {
    return this.value
  }

  public longValue(): bigint {
    return BigInt(this.value)
  }

  public numberValue(): number {
    return this.value
  }
}