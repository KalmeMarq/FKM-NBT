export default class BinaryReader {
    private buffer: Uint8Array
    private view: DataView
    private cursor = 0
    private textDecoder = new TextDecoder()
    private littleEndian?: boolean
    
    public constructor(buffer: Uint8Array, littleEndian?: boolean) {
        this.buffer = buffer
        this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
        this.littleEndian = littleEndian
    }

    public getOffset(): number {
        return this.cursor
    }

    public setOffset(offset: number): void {
        this.cursor = offset
    }
    
    public readByte(): number {
        const value = this.view.getInt8(this.cursor)
        this.cursor += 1
        return value
    }

    public readUByte(): number {
        const value = this.view.getUint8(this.cursor)
        this.cursor += 1
        return value
    }
    
    public readShort(littleEndian?: boolean): number {
        const value = this.view.getInt16(this.cursor, this.littleEndian ?? littleEndian)
        this.cursor += 2
        return value
    }

    public readUShort(littleEndian?: boolean): number {
        const value = this.view.getUint16(this.cursor, this.littleEndian ?? littleEndian)
        this.cursor += 2
        return value
    }
    
    public readInt(littleEndian?: boolean): number {
        const value = this.view.getInt32(this.cursor, this.littleEndian ?? littleEndian)
        this.cursor += 4
        return value
    }

    public readUInt(littleEndian?: boolean): number {
        const value = this.view.getUint32(this.cursor, this.littleEndian ?? littleEndian)
        this.cursor += 4
        return value
    }
    
    public readLong(littleEndian?: boolean): bigint {
        const value = this.view.getBigInt64(this.cursor, this.littleEndian ?? littleEndian)
        this.cursor += 8
        return value
    }

    public readULong(littleEndian?: boolean): bigint {
        const value = this.view.getBigUint64(this.cursor, this.littleEndian ?? littleEndian)
        this.cursor += 8
        return value
    }
    
    public readFloat(littleEndian?: boolean): number {
        const value = this.view.getFloat32(this.cursor, this.littleEndian ?? littleEndian)
        this.cursor += 4
        return value
    }
    
    public readDouble(littleEndian?: boolean): number {
        const value = this.view.getFloat64(this.cursor, this.littleEndian ?? littleEndian)
        this.cursor += 8
        return value
    }

    private getStringStorage(type: 'int16' | 'uint16' | 'int32' | 'uint32'): number {
        switch (type) {
            case 'uint32':
                return this.readUInt()
            case 'int32':
                return this.readInt()
            case 'uint16':
                return this.readUShort()
            case 'int16':
                return this.readShort()
        }
    }
    
    public readString(storage: 'int16' | 'uint16' | 'int32' | 'uint32' = 'uint16'): string {
        const length = this.getStringStorage(storage)
        return this.textDecoder.decode(this.buffer.subarray(this.cursor, this.cursor += length))
    }

    public readUCS2(storage?: 'int16' | 'uint16' | 'int32' | 'uint32'): string {
        return this.readString(storage)
    }

    public readUTF8(storage: 'int16' | 'uint16' | 'int32' | 'uint32' = 'uint16'): string {
        const length = this.getStringStorage(storage)
        const arr: number[] = []

        for (let i = 0; i < length; i++) arr.push(this.readByte())

        return arr.reduce((s, c) => s + String.fromCharCode(c), '')
    }
    
    public readFully(bytes: number[]): void {
        for(let i = 0; i < bytes.length; i++) {
            bytes[i] = this.readByte()
        }
    }

    public readVarInt(): number {
        let value = 0;
        let length = 0;
        let currentByte;

        while (true) {
            currentByte = this.readByte();
            value |= (currentByte & 0x7F) << (length * 7);
            
            length += 1;
            if (length > 5) {
                throw new RangeError("VarInt is too big");
            }

            if ((currentByte & 0x80) != 0x80) {
                break;
            }
        }
        return value;
    }

    // Aliases
    public readInt8(): number {
        return this.readByte()
    }

    public readInt16BE(): number {
        return this.readShort()
    }

    public readInt16LE(): number {
        return this.readShort(true)
    }

    public readUInt16BE(): number {
        return this.readUShort()
    }

    public readUInt16LE(): number {
        return this.readShort(true)
    }

    public readInt32BE(): number {
        return this.readInt()
    }

    public readInt32LE(): number {
        return this.readInt(true)
    }

    public readUInt32BE(): number {
        return this.readUInt()
    }

    public readUInt32LE(): number {
        return this.readInt(true)
    }

    public readInt64BE(): bigint {
        return this.readLong()
    }

    public readInt64LE(): bigint {
        return this.readLong(true)
    }

    public readUInt64BE(): bigint {
        return this.readULong()
    }

    public readUInt64LE(): bigint {
        return this.readULong(true)
    }

    public readFloat32BE(): number {
        return this.readFloat()
    }

    public readFloat32LE(): number {
        return this.readFloat(true)
    }

    public readFloat64BE(): number {
        return this.readDouble()
    }

    public readFloat64LE(): number {
        return this.readDouble(true)
    }

    public skipBytes(n: number): void {
        this.cursor += n
    }
}