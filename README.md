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
    value_size -> 2 bytes (uint16) if type is int size is 1 byte (uint8); if type is boolean or is element of array should not be present
    value -> size * 1 byte (uint8)

Packet:

    version -> 1 byte value
    data -> Array<Property>

How to serialize:
Recursively iterate in order the object and his properties


An example of serialized object:

    Uint8Array(71) [
        5,   4,   0,   2,   4, 110,  97, 109, 101,   5,   0,  80,
      101, 112, 112, 101,   1,   3,  97, 103, 101,   1,  23,   4,
        6, 103, 114,  97, 100, 101, 115,   1,   8,   0,   1,   0,
        1,   1,   1, 255,   2,   0,   0,   2, 255, 255,   4, 255,
      255, 255, 127,   3,   0, 255, 255,   5,   0, 255, 255, 255,
      127,   3,   7, 105, 115,  65, 100, 117, 108, 116,   1
    ]

As a json string this would be: 

    {
      "name": "Peppe",
      "age": 23,
      "grades": [
        0,
        1,
        255,
        -1,
        65535,
        2147483647,
        -65536,
        -2147483648 
      ],
      "isAdult": true
    }



    [ 5, 4, 0 ] this values identify the main type as 0x05 (object) with size 0x0400 (4 in little endian) 

    [ 2, 4, 110, 97, 109, 101 ] here says that has a property type 0x02 (string) with prop_size 0x04 and prop_name (110, 97, 109, 101)

    [5, 0, 80, 101, 112, 112, 101] here there is value_size 0x0500 (5 in little endian) and value (80, 101, 112, 112, 101)

The output of the deserialization process will be this:

    {
      name: 'Peppe',
      age: 23,
      grades: [ 0, 1, 255, -1, 65535, 2147483647, -65536, -2147483648 ],
      isAdult: true
    }

