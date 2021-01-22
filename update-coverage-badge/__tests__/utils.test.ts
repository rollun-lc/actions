import {replacer} from "../src/utils";
import * as fs    from "fs";

const readme         = `
![Coverage badge](https://img.shields.io/badge/Coverage%20Statements-0%25-red.svg)
![Coverage badge](https://img.shields.io/badge/Coverage%20Lines-14%25-red.svg)
![Coverage badge](https://img.shields.io/badge/Coverage%20Functions-88%25-red.svg)
![Coverage badge](https://img.shields.io/badge/Coverage%20Branches-87%25-red.svg)
`;
const expectedReadme = `
![Coverage badge](https://img.shields.io/badge/Coverage%20Statements-13.76%25-red.svg)
![Coverage badge](https://img.shields.io/badge/Coverage%20Lines-14.31%25-red.svg)
![Coverage badge](https://img.shields.io/badge/Coverage%20Functions-11.88%25-red.svg)
![Coverage badge](https://img.shields.io/badge/Coverage%20Branches-11.87%25-red.svg)
`;
const jsonSummary    = `
{
  "total": {
    "lines": {
      "total": 5694,
      "covered": 815,
      "skipped": 0,
      "pct": 14.31
    },
    "statements": {
      "total": 6041,
      "covered": 831,
      "skipped": 0,
      "pct": 13.76
    },
    "functions": {
      "total": 1920,
      "covered": 228,
      "skipped": 0,
      "pct": 11.88
    },
    "branches": {
      "total": 3303,
      "covered": 392,
      "skipped": 0,
      "pct": 11.87
    }
  }
}
`;

describe('replacer', () => {
  describe('replacer without files', () => {
    test('handle empty string input', () => {
      expect(() => replacer('', '')).toThrowError();
    })
  })

  describe('replacer with files', () => {
    beforeAll(() => {
      fs.writeFileSync('./README1.md', readme);
      fs.writeFileSync('./coverage-summary.json', jsonSummary);
    })

    afterAll(() => {
      fs.unlinkSync('./README1.md');
      fs.unlinkSync('./coverage-summary.json');
    })

    test('test if changes file', () => {
      replacer('./coverage-summary.json', './README1.md');
      expect(fs.readFileSync('./README1.md', 'utf-8')).toEqual(expectedReadme);
    })
  })

})
