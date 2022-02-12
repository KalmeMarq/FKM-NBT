import BinaryReader from '../utils/BinaryReader.ts'
import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTNumber } from "./NBTNumber.ts";
import { NBTType } from "./NBTType.ts";
import { NBTVisitor } from "./NBTVisitor.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";

export class NBTByte extends NBTNumber {
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

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitByte(this)
  }

  public static TYPE: NBTType<NBTByte> = new class extends NBTType<NBTByte> {
    public read<NBTByte>(reader: BinaryReader): NBTByte {
      return NBTByte.of(reader.readByte()) as unknown as NBTByte
    }
  
    public getTreeViewName(): string {
      return 'TAG_Byte'
    }
  }

  public getNBTType(): NBTType<NBTByte> {
    return NBTByte.TYPE
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

  public asString(): string {
    return new StringNBTWriter().apply(this)
  }

  /** @deprecated */
  public static reader = {
    read<NBTByte>(reader: BinaryReader): NBTByte {
      return NBTByte.of(reader.readByte()) as unknown as NBTByte
    }
  }
}