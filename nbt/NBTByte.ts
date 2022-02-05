import BinaryReader from "../BinaryReader.ts";
import BinaryWriter from "../BinaryWriter.ts";
import { NBTElement } from "./NBTElement.ts";
import { NBTTypeReader } from "./NBTTypeReader.ts";

export class NBTByte extends NBTElement {
  private value: number

  public constructor(value?: number) {
      super()
      this.value = value ?? 0
  }

  public static of(value: number): NBTByte
  public static of(value: boolean): NBTByte
  public static of(value: number | boolean): NBTByte {
    if (typeof value === 'boolean') {
        return value ? new NBTByte(1) : new NBTByte(0)
    } else {
        return new NBTByte(value)
    }
  }

  public override getType(): number {
    return 1
  }

  public write(writer: BinaryWriter): void {
    writer.writeByte(this.value)
  }

  public static reader = {
    read<NBTByte>(reader: BinaryReader): NBTByte {
      return NBTByte.of(reader.readByte()) as unknown as NBTByte
    }
  }
  
  public byteValue(): number {
    return this.value
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