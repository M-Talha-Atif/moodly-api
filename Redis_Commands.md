# First, get all keys (use SCAN instead of KEYS\* for safety)

SCAN 0 COUNT 1000

# This will return a cursor and list of keys. Continue scanning with:

SCAN <cursor_from_previous_result> COUNT 1000

# If you have a small number of keys, you can use:

KEYS \*

# Then for each key, get its value:

GET key_name
TYPE key_name # Check the data type first

# Check how many keys you have

DBSIZE

# Get a sample of keys (first 10)

SCAN 0 COUNT 10

# Check what types of data you have

INFO keyspace

# Check database size

DBSIZE

# Scan for keys

SCAN 0

# For each key found, check type and get value

TYPE user:123
GET user:123

TYPE session:abc
HGETALL session:abc
