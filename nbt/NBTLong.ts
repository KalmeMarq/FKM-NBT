import BinaryReader from '../utils/BinaryReader.ts'
import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTElement } from './NBTElement.ts'
import { NBTNumber } from "./NBTNumber.ts";
import { NBTType } from "./NBTType.ts";
import { NBTVisitor } from "./NBTVisitor.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";

export class NBTLong extends NBTNumber {
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

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitLong(this)
  }

  public static TYPE: NBTType<NBTLong> = new class extends NBTType<NBTLong> {
    public read<NBTLong>(reader: BinaryReader): NBTLong {
      return NBTLong.of(reader.readLong()) as unknown as NBTLong
    }
  
    public getTreeViewName(): string {
      return 'TAG_Long'
    }
  }

  public getNBTType(): NBTType<NBTLong> {
    return NBTLong.TYPE
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

  public asString(): string {
    return new StringNBTWriter().apply(this)
  }

  /** @deprecated */
  public static reader = {
    read<NBTLong>(reader: BinaryReader): NBTLong {
      return NBTLong.of(reader.readLong()) as unknown as NBTLong
    }
  }
}