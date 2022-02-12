import BinaryReader from '../utils/BinaryReader.ts'
import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTNumber } from "./NBTNumber.ts";
import { NBTType } from "./NBTType.ts";
import { NBTVisitor } from "./NBTVisitor.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";

export class NBTShort extends NBTNumber {
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

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitShort(this)
  }

  public static TYPE: NBTType<NBTShort> = new class extends NBTType<NBTShort> {
    public read<NBTShort>(reader: BinaryReader): NBTShort {
      return NBTShort.of(reader.readShort()) as unknown as NBTShort
    }
  
    public getTreeViewName(): string {
      return 'TAG_Short'
    }
  }

  public getNBTType(): NBTType<NBTShort> {
    return NBTShort.TYPE
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

  public asString(): string {
    return new StringNBTWriter().apply(this)
  }

  /** @deprecated */
  public static reader = {
    read<NBTShort>(reader: BinaryReader): NBTShort {
      return NBTShort.of(reader.readShort()) as unknown as NBTShort
    }
  }
}