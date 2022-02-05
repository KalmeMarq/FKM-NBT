import BinaryReader from "../BinaryReader.ts";
import BinaryWriter from "../BinaryWriter.ts";
import { NBTElement } from "./NBTElement.ts";
import { NBTTypeReader } from "./NBTTypeReader.ts";

export class NBTLong extends NBTElement {
  private value: bigint

  public constructor(value?: bigint) {
      super()
      this.value = value ?? 0n
  }

  public static of(value: bigint): NBTLong {
    return new NBTLong(value)
  }

  public override getType(): number {
    return 4
  }

  public write(writer: BinaryWriter): void {
    writer.writeLong(this.value)
  }

  public static reader = {
    read<NBTLong>(reader: BinaryReader): NBTLong {
      return NBTLong.of(reader.readLong()) as unknown as NBTLong
    }
  }
  
  public byteValue(): number {
    return Number(this.value & 0xFFn)
  }

  public shortValue(): number {
    return Number(this.value & 0xFFFFn)
  }

  public intValue(): number {
    return Math.floor(Number(this.value & 0xFFFFFFFFFFFFFFFFn))
  }

  public floatValue(): number {
    return Number(this.value)
  }

  public doubleValue(): number {
    return Number(this.value)
  }

  public longValue(): bigint {
    return this.value
  }

  public numberValue(): number {
    return Number(this.value)
  }
}