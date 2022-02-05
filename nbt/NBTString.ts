import BinaryReader from "../BinaryReader.ts";
import BinaryWriter from "../BinaryWriter.ts";
import { NBTElement } from "./NBTElement.ts";

export class NBTString extends NBTElement {
  private value: string

  public constructor(value?: string) {
      super()
      this.value = value ?? ''
  }

  public static of(value: string): NBTString {
      return new NBTString(value)
  }

  public override getType(): number {
    return 8
  }

  public write(writer: BinaryWriter): void {
    writer.writeString(this.value)
  }

  public asString(): string {
    return this.value
  }

  public static skip(reader: BinaryReader): void {
    reader.skipBytes(reader.readUShort())
  }

  public static reader = {
    read<NBTString>(reader: BinaryReader): NBTString {
      return NBTString.of(reader.readString()) as unknown as NBTString
    }
  }
}