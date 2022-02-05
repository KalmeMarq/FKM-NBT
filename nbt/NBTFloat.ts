import BinaryReader from "../BinaryReader.ts";
import BinaryWriter from "../BinaryWriter.ts";
import { NBTElement } from "./NBTElement.ts";
import { NBTTypeReader } from "./NBTTypeReader.ts";

export class NBTFloat extends NBTElement {
  private value: number

  public constructor(value?: number) {
      super()
      this.value = value ?? 0
  }

  public static of(value: number): NBTFloat {
    return new NBTFloat(value)
  }

  public override getType(): number {
    return 5
  }

  public write(writer: BinaryWriter): void {
    writer.writeFloat(this.value)
  }

  public static reader = {
    read<NBTFloat>(reader: BinaryReader): NBTFloat {
      return NBTFloat.of(reader.readFloat()) as unknown as NBTFloat
    }
  }
  
  public byteValue(): number {
    return Math.floor(this.value) & 0xFF
  }

  public shortValue(): number {
    return Math.floor(this.value) & 0xFFFF
  }

  public intValue(): number {
    return Math.floor(this.value)
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