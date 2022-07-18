import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  Res,
  Delete,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { Employee, IEmployee } from './schemas/employee.schema';
import { CreateNewEmployeeDto } from './dto/create-employee.dto';

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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:id')
  async find(@Param('id') id): Promise<IEmployee> {
    try {
      const resultEmployee = await this.employeeService.find(id);
      console.log(resultEmployee);
      if (!resultEmployee) {
        throw new HttpException(
          {
            status: HttpStatus.NO_CONTENT,
            error: { message: 'This employee does not exist or deleted' },
          },
          HttpStatus.NO_CONTENT,
        );
      }
      return resultEmployee;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: error.response.status,
          error: { message: error?.response?.error?.message ?? 'Error occur' },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: { message: error.response.message },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: { message: 'This employee does not exist or deleted' },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: { message: error.response.message },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
