import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { EmployeeModule } from './employee.module';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee, EmployeeSchema } from './schemas/employee.schema';

describe('Employee module', () => {
  let controller: EmployeeController;
  let service: EmployeeService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let employeeModel: Model<Employee>;

  // increase timeout execute action, avoid timeout database connection when network is slow
  jest.setTimeout(15000);

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri =
      'mongodb+srv://admin:pmtan056820703@swivelcluster.06ysi.mongodb.net/?retryWrites=true&w=majority';
    mongoConnection = (await connect(uri)).connection;
    employeeModel = mongoConnection.model(Employee.name, EmployeeSchema);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        EmployeeService,
        { provide: getModelToken(Employee.name), useValue: employeeModel },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  afterAll(async () => {
    await mongoConnection.close();
    await mongod.stop();
  });

  it('should be compiled', async () => {
    const module = await Test.createTestingModule({
      imports: [EmployeeModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(EmployeeController)).toBeInstanceOf(EmployeeController);
    expect(module.get(EmployeeService)).toBeInstanceOf(EmployeeService);
  });
});
