import BinaryReader from "../BinaryReader.ts";
import BinaryWriter from "../BinaryWriter.ts";
import { NBTElement } from "./NBTElement.ts";
import { NBTTypeReader } from "./NBTTypeReader.ts";

export class NBTInt extends NBTElement {
  private value: number

  public constructor(value?: number) {
      super()
      this.value = value ?? 0
  }

  public static of(value: number): NBTInt {
    return new NBTInt(value)
  }

  public override getType(): number {
    return 3
  }

  public write(writer: BinaryWriter): void {
    writer.writeInt(this.value)
  }

  public static reader = {
    read<NBTInt>(reader: BinaryReader): NBTInt {
      return NBTInt.of(reader.readInt()) as unknown as NBTInt
    }
  }
  
  public byteValue(): number {
    return this.value & 0xFF
  }

  public shortValue(): number {
    return this.value & 0xFFFF
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