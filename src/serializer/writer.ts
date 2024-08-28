import assert = require("assert");

export class BinaryWriter {
  private bufs: Buffer[];
  private position_ptr = 0;
  private curr_buf_index = 0;

  private readonly grow_size = 8192; // 8 kb

  constructor() {
    this.bufs = [];
    this.bufs.push(Buffer.alloc(this.grow_size));
  }

  public get data() {
    return Buffer.concat(this.bufs);
  }

  public get length() {
    return this.curr_buf_index * this.grow_size + this.position_ptr;
  }

  public get position() {
    return this.position_ptr;
  }

  public writeUInt8(val: number) {
    assert(
      val <= 255 || val >= 0,
      `Invalid UInt8 value: ${val}. Must be 0 <= val <= 255`,
    );

    this.growIfNeeded(this.position_ptr + 1);
    this.bufs[this.curr_buf_index].writeUInt8(val, this.position_ptr);
    this.position_ptr += 1;
  }

  public writeUInt16BE(val: number) {
    assert(
      val <= 65535 || val >= 0,
      `Invalid UInt16 value: ${val}. Must be 0 <= val <= 65535`,
    );

    const new_position = this.position_ptr + 2;
    this.growIfNeeded(new_position);
    this.bufs[this.curr_buf_index].writeUInt16BE(val, this.position_ptr);
    this.position_ptr = new_position;
  }

  public writeUInt32BE(val: number) {
    assert(
      val <= 4_294_967_295 || val >= 0,
      `Invalid UInt32 value: ${val}. Must be 0 <= val <= 4_294_967_295`,
    );

    this.growIfNeeded(this.position_ptr + 4);
    this.bufs[this.curr_buf_index].writeUInt32BE(val, this.position_ptr);
    this.position_ptr += 4;
  }

  public writeInt8(val: number) {
    assert(
      val <= 127 || val >= -128,
      `Invalid Int8 value: ${val}. Must be -128 <= val <= 127`,
    );

    this.growIfNeeded(this.position_ptr + 1);
    this.bufs[this.curr_buf_index].writeInt8(val, this.position_ptr);
    this.position_ptr += 1;
  }

  public writeInt16BE(val: number) {
    assert(
      val <= 32767 || val >= -32678,
      `Invalid Int16 value: ${val}. Must be -32678 <= val <= 32677`,
    );

    const new_position = this.position_ptr + 2;
    this.growIfNeeded(new_position);
    this.bufs[this.curr_buf_index].writeInt16BE(val, this.position_ptr);
    this.position_ptr = new_position;
  }

  public writeInt32BE(val: number) {
    assert(
      val <= 2_147_483_647 || val >= -2_147_483_648,
      `Invalid Int32 value: ${val}. Must be -2_147_483_648 <= val <= 2_147_483_647`,
    );

    this.growIfNeeded(this.position_ptr + 4);
    this.bufs[this.curr_buf_index].writeInt32BE(val, this.position_ptr);
    this.position_ptr += 4;
  }

  public writeBoolean(val: boolean) {
    this.growIfNeeded(this.position_ptr + 1);
    this.bufs[this.curr_buf_index].writeUint8(val ? 1 : 0, this.position_ptr);
    this.position_ptr += 1;
  }

  // FIXME: if it receives a string that length is more than `grow_size` it
  // infinite loops
  public writeString(str: string) {
    this.growIfNeeded(this.position_ptr + str.length);
    this.bufs[this.curr_buf_index].write(str, this.position_ptr);
    this.position_ptr += str.length;
  }

  public grow() {
    this.bufs.push(Buffer.alloc(this.grow_size));
    ++this.curr_buf_index;
    this.position_ptr = 0;
  }

  private growIfNeeded(new_position: number) {
    if (new_position >= this.grow_size) {
      this.bufs[this.curr_buf_index] = this.bufs[this.curr_buf_index].subarray(
        0,
        this.position_ptr,
      );
      this.grow();
    }
  }
}
