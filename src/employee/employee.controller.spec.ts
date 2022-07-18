import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee, EmployeeSchema, IEmployee } from './schemas/employee.schema';
import { AllEmployeeStub, RandomEmployeeStub } from './employee.dto.stub';

describe('EmployeeController', () => {
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  const cleanUpEmployeeObject = (employee: IEmployee) => {
    const { first_name, last_name, email, number, gender, photo } = employee;
    return {
      first_name,
      last_name,
      email,
      number,
      gender,
      photo,
    };
  };

  describe('visit GET /employee/', () => {
    it('should return all employee', async () => {
      const allEmployee = await controller.findAll();
      const allEmployeeCleanup = allEmployee.map((employee: IEmployee) => {
        return cleanUpEmployeeObject(employee);
      });
      expect(allEmployeeCleanup).toEqual(
        expect.arrayContaining(AllEmployeeStub()),
      );
    });
  });

  describe('visit GET /employee/:id', () => {
    it('should return a single employee when have right id', async () => {
      const allEmployee = await controller.findAll();
      const randomStubEmployee = RandomEmployeeStub();
      const targetEmployee = allEmployee.find(
        (employee) => employee.email === randomStubEmployee.email,
      );
      const singleEmployee = await controller.find(targetEmployee._id);
      expect(cleanUpEmployeeObject(singleEmployee)).toEqual(
        cleanUpEmployeeObject(targetEmployee),
      );
    });
    it('should throw error when have wrong id', async () => {
      const dummyObjectId = '62d5c4cc21b663306ef209c5';
      expect(async () => {
        await controller.find(dummyObjectId);
      }).rejects.toThrow();
    });
  });
  describe('visit POST /employee', () => {
    it('should create a new employee', async () => {
      const dummyRequestBody = {
        first_name: 'Tan',
        last_name: 'Pham Minh',
        email: 'pmtandhqn@gmail.com',
        gender: 'M',
        number: '+84383145401',
        photo: '',
      };
      const createdEmployee = await controller.create(dummyRequestBody);
      expect(cleanUpEmployeeObject(createdEmployee)).toEqual(dummyRequestBody);

      const createdEmployeeFromDB = await controller.find(createdEmployee._id);
      expect(cleanUpEmployeeObject(createdEmployeeFromDB)).toEqual(
        dummyRequestBody,
      );
    });
  });

  describe('visit DELETE /employee/:id', () => {
    it('should delete an employee with id', async () => {
      const allEmployee = await controller.findAll();
      const randomTargetEmployee =
        allEmployee[Math.floor(Math.random() * allEmployee.length)];
      await controller.delete(randomTargetEmployee._id);
      const freshAllEmployee = await controller.findAll();
      const isDeletedEmployee =
        freshAllEmployee.filter(
          (employee) => employee.email === randomTargetEmployee.email,
        ).length > 0
          ? false
          : true;
      expect(isDeletedEmployee).toEqual(true);
    });
  });
});
