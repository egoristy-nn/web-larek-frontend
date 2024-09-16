import { IItem, IOrderResult, IUser } from "../../types";
import { Api, ApiListResponse } from "../base/api";

export class LarekApi extends Api {

  getItemList(): Promise<ApiListResponse<IItem>> {
    return this.get<ApiListResponse<IItem>>('/product');
  }

  orderItems(order: IUser): Promise<ApiListResponse<IOrderResult>> {
    return this.post<ApiListResponse<IOrderResult>>('/order', order);
  }
}