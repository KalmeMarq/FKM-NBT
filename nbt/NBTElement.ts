import BinaryReader from "../BinaryReader.ts";
import BinaryWriter from "../BinaryWriter.ts";
import { NBTTypeReader } from "./NBTTypeReader.ts";

export abstract class NBTElement {
  abstract getType(): number

  abstract write(writer: BinaryWriter): void

  static reader: { read: <T = NBTElement>(reader: BinaryReader) => T }
}