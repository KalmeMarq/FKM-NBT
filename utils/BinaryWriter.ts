export default class BinaryWriter {
    private buffer: Uint8Array
    private view: DataView
    private cursor = 0
    private textEncoder = new TextEncoder()
    private littleEndian?: boolean
    
    public constructor(buffer?: Uint8Array) {
        this.buffer = buffer ?? new Uint8Array(1048576)
        this.view = new DataView(this.buffer.buffer)
    }

    public useLittleEndian(little: boolean): void {
        this.littleEndian = little
    }

    public getOffset(): number {
        return this.cursor
    }

    public setOffset(offset: number): void {
        this.cursor = offset
    }
    
    private ensureCapacity(size: number): void {
        let newLength = this.buffer.length
        while (newLength < this.cursor + size) newLength *= 2
        
        if (newLength != this.buffer.length) {
            const oldBuffer = this.buffer
            this.buffer = new Uint8Array(newLength)
            this.buffer.set(oldBuffer)
            this.view = new DataView(this.buffer.buffer)
        }
    }
    
    public writeByte(value: number): void {
        this.ensureCapacity(1)
        
        // this.view.setInt8(this.cursor, value)
        this.buffer[this.cursor] = value & 0xff

        this.cursor += 1
    }

    public writeUByte(value: number): void {
        this.ensureCapacity(1)
        this.view.setUint8(this.cursor, value)
        this.cursor += 1
    }
    
    public writeShort(value: number, littleEndian?: boolean): void {
        this.ensureCapacity(2)
        
        // this.view.setInt16(this.cursor, value, this.littleEndian ?? littleEndian)
        if (this.littleEndian ?? littleEndian) {
            this.buffer[this.cursor] = value & 0xff
            this.buffer[this.cursor + 1] = value >> 8
        } else {
            this.buffer[this.cursor + 1] = value & 0xff
            this.buffer[this.cursor] = value >> 8
        }

        this.cursor += 2
    }

    public writeUShort(value: number, littleEndian?: boolean): void {
        this.ensureCapacity(2)
        this.view.setUint16(this.cursor, value, this.littleEndian ?? littleEndian)
        this.cursor += 2
    }
    
    public writeInt(value: number, littleEndian?: boolean): void {
        this.ensureCapacity(4)

        // this.view.setInt32(this.cursor, value, this.littleEndian ?? littleEndian)
        if (this.littleEndian ?? littleEndian) {
            this.buffer[this.cursor] = value & 0xff
            this.buffer[this.cursor + 1] = value >> 8
            this.buffer[this.cursor + 2] = value >> 16
            this.buffer[this.cursor + 3] = value >> 24
        } else {
            this.buffer[this.cursor + 3] = value & 0xff
            this.buffer[this.cursor + 2] = value >> 8
            this.buffer[this.cursor + 1] = value >> 16
            this.buffer[this.cursor] = value >> 24
        }

        this.cursor += 4
    }

    public writeUInt(value: number, littleEndian?: boolean): void {
        this.ensureCapacity(4)
        this.view.setUint32(this.cursor, value, this.littleEndian ?? littleEndian)
        this.cursor += 4
    }
    
    public writeLong(value: bigint, littleEndian?: boolean): void {
        this.ensureCapacity(8)
        this.view.setBigInt64(this.cursor, value, this.littleEndian ?? littleEndian)
        this.cursor += 8
    }

    public writeULong(value: bigint, littleEndian?: boolean): void {
        this.ensureCapacity(8)
        this.view.setBigUint64(this.cursor, value, this.littleEndian ?? littleEndian)
        this.cursor += 8
    }
    
    public writeFloat(value: number, littleEndian?: boolean): void {
        this.ensureCapacity(4)
        this.view.setFloat32(this.cursor, value, this.littleEndian ?? littleEndian)
        this.cursor += 4
    }
 
    public writeDouble(value: number, littleEndian?: boolean): void {
        this.ensureCapacity(8)
        this.view.setFloat64(this.cursor, value, this.littleEndian ?? littleEndian)
        this.cursor += 8
    }
    
    public writeBuffer(value: Uint8Array): void {
        this.ensureCapacity(value.length)
        this.buffer.set(value, this.cursor)
        this.cursor += value.length
    }

    private writeStringStorage(length: number, type: 'int16' | 'uint16' | 'int32' | 'uint32'): void {
        switch (type) {
            case 'uint32':
                return this.writeUInt(length)
            case 'int32':
                return this.writeInt(length)
            case 'uint16':
                return this.writeUShort(length)
            case 'int16':
                return this.writeShort(length)
        }
    }
    
    public writeString(value: string, storage: 'int16' | 'uint16' | 'int32' | 'uint32' = 'uint16'): void {
        const buffer = this.textEncoder.encode(value)
        this.writeStringStorage(buffer.length, storage)
        this.writeBuffer(buffer)
    }

    public writeUCS2(value: string, storage: 'int16' | 'uint16' | 'int32' | 'uint32' = 'uint16'): void {
        let i = 0
        for (const _char of value) i += 2

        this.writeStringStorage(i, storage)
        for (const char of value) {
            const code = char.charCodeAt(0)
            this.writeUInt16BE(code)
        }
    }

    public writeUTF8(value: string, storage: 'int16' | 'uint16' | 'int32' | 'uint32' = 'uint16'): void {
        this.writeStringStorage(value.length, storage)
        for (const char of value) {
            const code = char.charCodeAt(0)
            this.writeUInt8(code)
        }
    }

    public writeVarInt(value: number): void {
        while (true) {
            if ((value & ~0x7F) == 0) {
              this.writeByte(value)
              return
            }
    
            this.writeByte((value & 0x7F) | 0x80)
            value >>>= 7
        }
    }
    
    public write(value: number[]): void {
        value.forEach(v => {
            this.writeByte(v)
        })
    }
    
    public flush(): Uint8Array {
        return this.buffer.subarray(0, this.cursor)
    }

    public drop(): void {
        this.cursor = 0
    }

    public writeInt8(value: number): void {
        this.writeByte(value)
    }

    public writeUInt8(value: number): void {
        this.writeUByte(value)
    }

    public writeInt16BE(value: number): void {
        this.writeShort(value)
    }

    public writeUInt16BE(value: number): void {
        this.writeUShort(value)
    }

    public writeInt16LE(value: number): void {
        this.writeShort(value, true)
    }

    public writeUInt16LE(value: number): void {
        this.writeUShort(value, true)
    }

    public writeInt32BE(value: number): void {
        this.writeInt(value, false)
    }

    public writeUInt32BE(value: number): void {
        this.writeUInt(value, false)
    }

    public writeInt32LE(value: number): void {
        this.writeInt(value, true)
    }

    public writeUInt32LE(value: number): void {
        this.writeUInt(value, true)
    }

    public writeInt64BE(value: bigint): void {
        this.writeLong(value, false)
    }

    public writeUInt64BE(value: bigint): void {
        this.writeULong(value, false)
    }

    public writeInt64LE(value: bigint): void {
        this.writeLong(value, true)
    }

    public writeUInt64LE(value: bigint): void {
        this.writeULong(value, true)
    }

    public writeFloat32BE(value: number): void {
        this.writeFloat(value, false)
    }

    public writeFloat32LE(value: number): void {
        this.writeFloat(value, true)
    }

    public writeFloat64BE(value: number): void {
        this.writeDouble(value, false)
    }

    public writeFloat64LE(value: number): void {
        this.writeDouble(value, true)
    }

    public writeBytes(value: number[]): void {
        this.write(value)
    }
}

// export class BinaryWriterUnstable
// {
//     private buffer: number[] = []
//     private offset: number

//     public constructor()
//     {
//         this.buffer = []
//         this.offset = 0
//     }

//     public writeUInt8(value: number): void
//     {
//         this.buffer[this.offset] = value & 0xff
//         this.offset++
//     }

//     public writeInt8(value: number): void
//     {
//         if (value < 0) value = 0xff + value + 1
//         this.buffer[this.offset] = value & 0xff
//         this.offset++
//     }

//     public writeByte(value: number): void
//     {
//         this.writeUInt8(value)
//     }

//     public writeSByte(value: number): void
//     {
//         this.writeInt8(value)
//     }

//     public writeUInt16(value: number, littleEndian?: boolean): void
//     {
//         if (littleEndian)
//         {
//             this.buffer[this.offset + 1] = value & 0xff
//             this.buffer[this.offset] = value >> 8
//         }
//         else
//         {
//             this.buffer[this.offset] = value & 0xff
//             this.buffer[this.offset + 1] = value >> 8
//         }
//         this.offset += 2
//     }

//     public writeInt16(value: number, littleEndian?: boolean): void
//     {
//         if (littleEndian)
//         {
//             this.buffer[this.offset + 1] = value & 0xff
//             this.buffer[this.offset] = value >> 8
//         }
//         else
//         {
//             this.buffer[this.offset] = value & 0xff
//             this.buffer[this.offset + 1] = value >> 8
//         }
//         this.offset += 2
//     }

//     public writeUInt16BE(value: number): void
//     {
//         this.writeUInt16(value, false)
//     }

//     public writeUInt16LE(value: number): void
//     {
//         this.writeUInt16(value, true)
//     }

//     public writeInt16BE(value: number): void
//     {
//         this.writeInt16(value, false)
//     }

//     public writeInt16LE(value: number): void
//     {
//         this.writeInt16(value, true)
//     }

//     public writeShort(value: number, littleEndian?: boolean): void
//     {
//         this.writeInt16(value, littleEndian)
//     }

//     public writeUShort(value: number, littleEndian?: boolean): void
//     {
//         this.writeUInt16(value, littleEndian)
//     }

//     public writeUInt32(value: number, littleEndian?: boolean): void
//     {
//         if (littleEndian)
//         {
//             this.buffer[this.offset] = value >> 24
//             this.buffer[this.offset + 1] = value >> 16
//             this.buffer[this.offset + 2] = value >> 8
//             this.buffer[this.offset + 3] = value & 0xff
//         }
//         else
//         {
//             this.buffer[this.offset + 3] = value >> 24
//             this.buffer[this.offset + 2] = value >> 16
//             this.buffer[this.offset + 1] = value >> 8
//             this.buffer[this.offset] = value & 0xff
//         }
//         this.offset += 4
//     }

//     public writeInt32(value: number, littleEndian?: boolean): void
//     {
//         if (littleEndian)
//         {
//             this.buffer[this.offset + 3] = value & 0xff
//             this.buffer[this.offset + 2] = value >> 8
//             this.buffer[this.offset + 1] = value >> 16
//             this.buffer[this.offset] = value >> 24
//         }
//         else
//         {
//             this.buffer[this.offset] = value & 0xff
//             this.buffer[this.offset + 1] = value >> 8
//             this.buffer[this.offset + 2] = value >> 16
//             this.buffer[this.offset + 3] = value >> 24
//         }
//         this.offset += 4

//         return 
//     }

//     public writeUInt32BE(value: number): void {
//         this.writeUInt32(value, false)
//     }

//     public writeUInt32LE(value: number): void {
//         this.writeUInt32(value, true)
//     }

//     public writeInt32BE(value: number): void {
//         this.writeInt32(value, false)
//     }

//     public writeInt32LE(value: number): void {
//         this.writeInt32(value, true)
//     }

//     public writeInt(value: number, littleEndian?: boolean): void {
//         this.writeInt32(value, littleEndian)
//     }

//     public writeUInt(value: number, littleEndian?: boolean): void {
//         this.writeUInt32(value, littleEndian)
//     }

//     public writeUInt64(value: bigint, littleEndian?: boolean): void {
//         this.offset += 8
//     }

//     public writeInt64(value: bigint, littleEndian?: boolean): void {
//         this.offset += 8
//     }

//     public writeFloat32(value: number, littleEndian?: boolean): void {
//         this.offset += 8
//     }

//     public writeFloat64(value: bigint, littleEndian?: boolean): void {
//         if (littleEndian) {
            
//         } else {
//             this.buffer[this.offset] = value
//         }
//         this.offset += 8
//     }
// }