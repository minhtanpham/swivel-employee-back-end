import * as fs from 'fs';
import { IEmployee } from './schemas/employee.schema';

const seedFileContent = fs.readFileSync('employees.json', 'utf-8');
const seedData: IEmployee[] = JSON.parse(seedFileContent);

export const AllEmployeeStub = (): IEmployee[] => {
  return seedData;
};

export const RandomEmployeeStub = (): IEmployee => {
  return seedData[Math.floor(Math.random() * seedData.length)];
};

export const SingleEmployeeStub = (id: string): IEmployee => {
  return seedData.find((employee) => employee._id === id);
};
