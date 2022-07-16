import { Controller, Get } from '@nestjs/common';

import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('/seed')
  seed(): Promise<string> {
    return this.employeeService.seed();
  }

  @Get()
  findAll(): Promise<any> {
    return this.employeeService.findAll();
  }
}
