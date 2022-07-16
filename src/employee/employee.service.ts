import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';

import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { CreateNewEmployeeDto } from './dto/create-employee.dto';

const seedFileContent = fs.readFileSync('employees.json', 'utf-8');
const seedData = JSON.parse(seedFileContent);

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
  ) {}

  async seed(): Promise<string> {
    try {
      for (let i = 0; i < seedData.length; i++) {
        const newEmployee = new this.employeeModel(seedData[i]);
        await newEmployee.save();
      }
      return 'Prepare data success';
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  async create(createCatDto: CreateNewEmployeeDto): Promise<Employee> {
    const createdEmployee = new this.employeeModel(createCatDto);
    return createdEmployee.save();
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeModel.find().exec();
  }
}
