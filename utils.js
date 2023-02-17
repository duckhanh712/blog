import fs from 'fs'

export const sleep = ms => {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

export const log = ({ page, fileName }) => {
  fs.writeFile(`./logs/${fileName}.txt`, page, err => {
    if (err) {
      console.error(err)
    }
    // file written successfully
  })
}
