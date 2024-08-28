PropertyType:
    
    number -> 0x01
    string -> 0x02 
    bool -> 0x03 
    array -> 0x04 
    object -> 0x05 

Property:

    type (Property Type) -> 1 byte (uint8) 
    prop_name_size -> 1 byte (uint8) if element of array should not be present
    prop_name -> name_size * 1 byte (uint8) if is element of array should not be present
    array_type (Property Type) -> 1 byte (uint8) shoud be present only for array types
    array_size -> 2 bytes should be present only for array types
    value_size -> 2 bytes (uint16); should not be present in boolean and int types 
    value -> value_size * 1 byte (uint8)

Packet:

    data -> Array<Property>

An example of serialized object:

    <Buffer 05 00 04 02 04 6e 61 6d 65 00 05 50 65 70 70 65 01 03 61 67 65 00
    00 00 17 04 06 67 72 61 64 65 73 01 00 08 00 00 00 00 00 00 00 01 00 00 00 
    ff ff ff ... 28 more bytes>

As a json string this would be: 

    {
      "name": "Peppe",
      "age": 23,
      "grades": [
        0, 1,
        255, -1,
        65535, 2147483647,
        -65536, -2147483648 
      ],
      "isAdult": true
    }

Break down of the serialized object:

    [ 05 00 04 ] this values identify the main type as 05 (object) with size 00 04 (4 in big endian)

    [ 02 04 6e 61 6d 65 ] here says that has a property type 02 (string) with prop_size 04 and prop_name (6e 61 6d 65)
    
    [ 00 05 50 65 70 70 65 ] here there is value_size 00 05 (5 in big endian) and value (50 65 70 70 65)
    
    ...

The output of the deserialization process will be this:

    {
      name: 'Peppe',
      age: 23,
      grades: [ 0, 1, 255, -1, 65535, 2147483647, -65536, -2147483648 ],
      isAdult: true
    }

# TODO

- [ ] Add numerical types (UInt8, Int8, UInt16, Int16, UInt32, Int32, UInt64, Int64)
- [ ] Add maps support (e.g `Map<string, string>`)
- [ ] Add UTF-8 support for strings (currently only supports ASCII)
- [X] Explore other ways to deserialize (DataView)
- [X] Avoid reallocation of buffer with subarray on `BinaryWriter.grow`
- [ ] Write tests


