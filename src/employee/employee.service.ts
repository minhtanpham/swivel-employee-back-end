import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';

import {
  Employee,
  EmployeeDocument,
  IEmployee,
} from './schemas/employee.schema';
import { CreateNewEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

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
        const newEmployee = new this.employeeModel({
          ...seedData[i],
          deleted: false,
          created_date: new Date().toUTCString(),
          updated_date: new Date().toUTCString(),
        });
        await newEmployee.save();
      }
      return 'Prepare data success';
    } catch (error) {
      return error.message;
    }
  }

  async create(createCatDto: CreateNewEmployeeDto): Promise<Employee> {
    try {
      const createdEmployee = new this.employeeModel({
        ...createCatDto,
        deleted: false,
        created_date: new Date().toUTCString(),
        updated_date: new Date().toUTCString(),
      });
      return createdEmployee.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<Employee[]> {
    try {
      return this.employeeModel.find({ deleted: false }).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async find(id: string): Promise<IEmployee> {
    try {
      const targetEmployee: IEmployee = await this.employeeModel
        .findById(id)
        .exec();
      if (!targetEmployee || targetEmployee?.deleted) {
        return null;
      }
      return targetEmployee;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    try {
      const targetEmployee = await this.employeeModel.findById(id).exec();
      if (targetEmployee) {
        await this.employeeModel.findByIdAndUpdate(id, {
          ...updateEmployeeDto,
        });
        return this.employeeModel.findById(id).exec();
      } else {
        return null;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const deletedEmployee = await this.employeeModel.findById(id).exec();
      if (deletedEmployee) {
        await this.employeeModel
          .findByIdAndUpdate(id, { deleted: true })
          .exec();
        return 'Success';
      } else {
        return null;
      }
    } catch (error) {
      throw new InternalServerErrorException(error?.message ?? 'Error occur');
    }
  }
}
