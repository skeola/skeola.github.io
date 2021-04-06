import json

fixedData = {}

# with open("js/legs.json", "r") as f_in:
#   text = f_in.read()
#   text_json = json.loads(text)
#   for obj in text_json["data"]:
#     name = obj["name"]
#     del obj["name"]
#     fixedData[name] = obj
#   print(fixedData)

# with open("js/legs_fixed.json", "w") as f_out:
#   output = json.dumps(fixedData, indent=2)
#   f_out.write(output)

with open("js/decorations.json", "r") as f_in:
  text = f_in.read()
  text_json = json.loads(text)
  for obj in text_json["data"]:
    fixedData[obj["name"]] = obj["cost"]
  print(fixedData)

with open("js/decorations_fixed.json", "w") as f_out:
  output = json.dumps(fixedData, indent=2)
  f_out.write(output)