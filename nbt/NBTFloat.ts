import BinaryReader from '../utils/BinaryReader.ts'
import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTElement } from './NBTElement.ts'
import { NBTNumber } from "./NBTNumber.ts";
import { NBTType } from "./NBTType.ts";
import { NBTVisitor } from "./NBTVisitor.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";

export class NBTFloat extends NBTNumber {
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

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitFloat(this)
  }

  public static TYPE: NBTType<NBTFloat> = new class extends NBTType<NBTFloat> {
    public read<NBTFloat>(reader: BinaryReader): NBTFloat {
      return NBTFloat.of(reader.readFloat()) as unknown as NBTFloat
    }
  
    public getTreeViewName(): string {
      return 'TAG_Float'
    }
  }

  public getNBTType(): NBTType<NBTFloat> {
    return NBTFloat.TYPE
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

  public asString(): string {
    return new StringNBTWriter().apply(this)
  }

  /** @deprecated */
  public static reader = {
    read<NBTFloat>(reader: BinaryReader): NBTFloat {
      return NBTFloat.of(reader.readFloat()) as unknown as NBTFloat
    }
  }
}