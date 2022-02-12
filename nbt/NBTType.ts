import BinaryReader from "../utils/BinaryReader.ts";
import { NBTElement } from "./NBTElement.ts";

export abstract class NBTType<T extends NBTElement> {
  abstract read(reader: BinaryReader): T

  abstract getTreeViewName(): string
} 