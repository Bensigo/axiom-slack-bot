import { Model, Document } from "mongoose";
import { userDocument } from "../../interface/user";


export class BaseService<T extends Document> {
    constructor(private readonly model: Model<T>) {}
  
    async create(data: any): Promise<T> {
      const doc = new this.model(data);
      await doc.save();
      return doc;
    }
  
    async findOne(query: any, projection?: any): Promise<userDocument | null> {
      return this.model.findOne(query, projection);
    }
    async findOneAndUpdate(query: any, update: any){
      return this.model.findOneAndUpdate(query, update).exec()
    }
  }