import time
import sys
import random
import json

def main(id):
  x = 0
  
  runner = { "args": [ id, 0 ], "func": "update_progress" }
  
  while x < 100:
    x = x + random.randint(1, 5)
    if x > 100:
      x = 100
    runner["args"][1] = x
    print("$#! {}".format(json.dumps(runner)))
    sys.stdout.flush()
    time.sleep(10)
  
if __name__ == "__main__":
  main(sys.argv[1])