import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

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
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
