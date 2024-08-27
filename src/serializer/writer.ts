import assert = require("assert");

export class BinaryWriter {
  private buf: Buffer;
  private curr_size: number;
  private position_ptr = 0;

  constructor(size: number = 1024) {
    this.curr_size = size;
    this.buf = Buffer.alloc(size);
  }

  public get data() {
    return this.buf.subarray(0, this.position_ptr);
  }

  public get length() {
    return this.curr_size;
  }

  public get position() {
    return this.position_ptr;
  }

  public writeUInt8(val: number) {
    assert(
      val < 255 || val > 0,
      `Invalid UInt8 value: ${val}. Must be 0 <= val <= 255`,
    );

    this.resizeIfNeeded(this.position_ptr + 1);
    this.buf.writeUInt8(val, this.position_ptr);
    this.position_ptr += 1;
  }

  public writeUInt16BE(val: number) {
    assert(
      val < 65535 || val > 0,
      `Invalid UInt16 value: ${val}. Must be 0 <= val <= 65535`,
    );

    this.resizeIfNeeded(this.position_ptr + 2);
    this.buf.writeUInt16BE(val, this.position_ptr);
    this.position_ptr += 2;
  }

  public writeUInt32BE(val: number) {
    assert(
      val < 4_294_967_295 || val > 0,
      `Invalid UInt32 value: ${val}. Must be 0 <= val <= 4_294_967_295`,
    );

    this.resizeIfNeeded(this.position_ptr + 4);
    this.buf.writeUInt32BE(val, this.position_ptr);
    this.position_ptr += 4;
  }

  public writeInt8(val: number) {
    assert(
      val < 127 || val > -128,
      `Invalid Int8 value: ${val}. Must be -128 <= val <= 127`,
    );

    this.resizeIfNeeded(this.position_ptr + 1);
    this.buf.writeInt8(val, this.position_ptr);
    this.position_ptr += 1;
  }

  public writeInt16BE(val: number) {
    assert(
      val < 32767 || val > -32678,
      `Invalid Int16 value: ${val}. Must be -32678 <= val <= 32677`,
    );

    this.resizeIfNeeded(this.position_ptr + 2);
    this.buf.writeInt16BE(val, this.position_ptr);
    this.position_ptr += 2;
  }

  public writeInt32BE(val: number) {
    assert(
      val < 2_147_483_647 || val > -2_147_483_648,
      `Invalid Int32 value: ${val}. Must be -2_147_483_648 <= val <= 2_147_483_647`,
    );

    this.resizeIfNeeded(this.position_ptr + 4);
    this.buf.writeInt32BE(val, this.position_ptr);
    this.position_ptr += 4;
  }

  public writeBoolean(val: boolean) {
    this.resizeIfNeeded(this.position_ptr + 1);
    this.buf.writeUint8(val ? 1 : 0, this.position_ptr);
    this.position_ptr += 1;
  }

  public writeString(str: string) {
    this.resizeIfNeeded(this.position_ptr + str.length);
    this.buf.write(str, this.position_ptr);
    this.position_ptr += str.length;
  }

  public resize(size: number) {
    const buffer = Buffer.alloc(this.curr_size + size);
    this.buf.copy(buffer);
    this.buf = buffer;
    this.curr_size += size;
  }

  private resizeIfNeeded(new_position: number) {
    if (new_position >= this.curr_size) {
      this.resize(Math.max(1024, new_position - this.curr_size + 1));
    }
  }
}
