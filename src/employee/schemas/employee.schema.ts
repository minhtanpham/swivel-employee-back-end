import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

export interface IEmployee {
  first_name: string;
  last_name: string;
  number: string;
  gender: string;
  photo?: string;
  deleted?: boolean;
  created_date: Date;
  updated_date: Date;
}

@Schema()
export class Employee {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true })
  gender: string;

  @Prop()
  photo: string;

  @Prop()
  created_date: Date;

  @Prop()
  updated_date: Date;

  @Prop({ select: false })
  deleted: boolean;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
