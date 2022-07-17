import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  Res,
  Delete,
  NotFoundException,
} from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { IEmployee } from './schemas/employee.schema';
import { CreateNewEmployeeDto } from './dto/create-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('/seed')
  async seed(@Res() res): Promise<string> {
    try {
      const result = await this.employeeService.seed();
      return res.status(HttpStatus.OK).json({
        message: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get()
  async findAll(@Res() res): Promise<IEmployee[]> {
    try {
      const allEmployee = await this.employeeService.findAll();
      return res.status(HttpStatus.OK).json(allEmployee);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get('/:id')
  async find(@Param('id') id, @Res() res): Promise<IEmployee | string> {
    try {
      const resultEmployee = await this.employeeService.find(id);
      if (!resultEmployee) {
        return res
          .status(HttpStatus.NO_CONTENT)
          .json({ message: 'This employee does not exist or deleted' });
      }
      return res.status(HttpStatus.OK).json(resultEmployee);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response.message);
    }
  }

  @Post('/')
  async create(
    @Body() createEmployeeDto: CreateNewEmployeeDto,
    @Res() res,
  ): Promise<IEmployee> {
    try {
      const savedEmployee = await this.employeeService.create(
        createEmployeeDto,
      );
      return res.status(HttpStatus.OK).json(savedEmployee);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response.message);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id, @Res() res): Promise<string> {
    try {
      const deletedResult = await this.employeeService.delete(id);
      if (deletedResult) {
        return res.status(HttpStatus.OK).json('Delete success');
      }
      return res
        .status(HttpStatus.NO_CONTENT)
        .json({ message: 'This employee does not exist or deleted' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response.message);
    }
  }
}
