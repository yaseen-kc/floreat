const fs = require('fs');

const prismaFiles = [
  'backend/prisma/models/mezzanine.prisma',
  'backend/prisma/models/joint.prisma',
  'backend/prisma/models/accessories.prisma',
  'backend/prisma/models/stair.prisma'
];

for (const file of prismaFiles) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/ @map\("MEZ_\d+"\)/g, '');
  content = content.replace(/ @map\("EXT_\d+"\)/g, '');
  content = content.replace(/ @map\("[A-Z]_\d+"\)/g, '');
  content = content.replace(/ @map\("PRE_GALVANISED"\)/g, '');
  content = content.replace(/ @map\("CUT_OUT"\)/g, '');
  fs.writeFileSync(file, content);
  console.log('Cleaned @map in', file);
}
