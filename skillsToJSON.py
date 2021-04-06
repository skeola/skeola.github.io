import json

skills = {}

f = open("js/skills.txt", "r")
for line in f:
  data = line.split(", ")
  if len(data)!=2:
    print(line)
  else:
    skills[data[0]] = int(data[1])

print(skills)
with open("js/skills.json", "w") as f_out:
  output = json.dumps(skills, indent=2)
  f_out.write(output)