import BinaryWriter from "../BinaryWriter.ts";
import { NBTElement } from "./NBTElement.ts";

export class NBTNull extends NBTElement {
  public constructor() {
    super()
  }

  public getType(): number {
    return 0
  }

  public write(writer: BinaryWriter): void {
  }
}