var fs = require('fs');
const glob = require("glob");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dirName = "";

glob(`${dirName}/**/*.csproj`, null, function (err, files) {
  if (err) throw err;

  const assemblies = [];

  files.forEach(file => {
    fs.readFile(file, function (err, data) {
      if (err) throw err;

      const dom = new JSDOM(data);
      const assemblyName = dom.window.document.getElementsByTagName("AssemblyName")[0].childNodes[0].nodeValue;
      const outputType = dom.window.document.getElementsByTagName("OutputType")[0].childNodes[0].nodeValue;
      
      switch(outputType) {
        case "Library": 
          const name = `${assemblyName}.dll`;
          if (!assemblies.includes(name)) {
            console.log(name);
            assemblies.push(name);
          }
          break;
        case "WinExe":
        case "Exe":
          const exeName = `${assemblyName}.exe`;
          if (!assemblies.includes(exeName)) {
            console.log(exeName);
            assemblies.push(exeName);
          }
          break;
        default:
          console.log(`Assembly: ${assemblyName}, OutputType: ${outputType}`);
          break;
      }
    })
  })
})