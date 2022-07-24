import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  Delete,
  HttpException,
  Put,
} from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { IEmployee } from './schemas/employee.schema';
import { CreateNewEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('/seed')
  async seed(): Promise<string> {
    try {
      const result = await this.employeeService.seed();
      return result;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<IEmployee[]> {
    try {
      const allEmployee = await this.employeeService.findAll();
      return allEmployee;
    } catch (error) {
      const { response = 'Error! Please try again', status = 500 } = error;
      if (response?.message) {
        throw new HttpException(response.message, status);
      } else {
        throw new HttpException(response, status);
      }
    }
  }

  @Get('/:id')
  async find(@Param('id') id): Promise<IEmployee> {
    try {
      const resultEmployee = await this.employeeService.find(id);
      if (!resultEmployee) {
        throw new HttpException(
          'This employee does not exist or deleted',
          HttpStatus.NOT_FOUND,
        );
      }
      return resultEmployee;
    } catch (error) {
      const { response = 'Error! Please try again', status = 500 } = error;
      if (response?.message) {
        throw new HttpException(response.message, status);
      } else {
        throw new HttpException(response, status);
      }
    }
  }

  @Post('/')
  async create(
    @Body() createEmployeeDto: CreateNewEmployeeDto,
  ): Promise<IEmployee> {
    try {
      const savedEmployee = await this.employeeService.create(
        createEmployeeDto,
      );
      return savedEmployee;
    } catch (error) {
      const { response = 'Error! Please try again', status = 500 } = error;
      if (response?.message) {
        throw new HttpException(response.message, status);
      } else {
        throw new HttpException(response, status);
      }
    }
  }

  @Put('/:id')
  async update(
    @Param('id') id,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<IEmployee> {
    try {
      const updatedEmployee = await this.employeeService.update(
        id,
        updateEmployeeDto,
      );
      if (!updatedEmployee) {
        throw new HttpException(
          'This employee email already existed',
          HttpStatus.BAD_REQUEST,
        );
      }
      return updatedEmployee;
    } catch (error) {
      const { response = 'Error! Please try again', status = 500 } = error;
      if (response?.message) {
        throw new HttpException(response.message, status);
      } else {
        throw new HttpException(response, status);
      }
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id): Promise<Record<string, string>> {
    try {
      const deletedResult = await this.employeeService.delete(id);
      if (deletedResult) {
        return { message: 'Delete success' };
      }
      throw new HttpException(
        'This employee does not exist or deleted',
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      const { response = 'Error! Please try again', status = 500 } = error;
      if (response?.message) {
        throw new HttpException(response.message, status);
      } else {
        throw new HttpException(response, status);
      }
    }
  }
}
