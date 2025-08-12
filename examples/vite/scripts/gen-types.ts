// // scripts/extract-types.ts
// import { Project } from 'ts-morph'
// import fs from 'fs'

// const project = new Project()
// const source = project.addSourceFileAtPath('/Users/martimayoral/Documents/GitHub/fortkit/packages/openfort-react/build/components/OpenfortKit/types.d.ts')

// const output = source.getVariableDeclarations().map((i) => ({
//   name: i.getName(),
//   // props: i.getProperties().map((p) => ({
//   //   name: p.getName(),
//   //   type: p.getType().getText(),
//   // })),
// }))

// fs.writeFileSync('src/generated/type-data.json', JSON.stringify(output, null, 2))
