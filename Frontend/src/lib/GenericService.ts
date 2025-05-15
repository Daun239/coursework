import axios from "axios";
import { IGenericService } from "./IGenericService";

export class GenericService<TDto> implements IGenericService<TDto> {
  constructor(private baseUrl: string) {}

  async getAll(
    filter?: string,
    sortBy?: string,
    page: number = 1,
    pageSize: number = 1000000
  ): Promise<TDto[]> {
    const params = new URLSearchParams();
    if (filter) params.append("dynamicFilter", filter);
    if (sortBy) params.append("sortBy", sortBy);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const response = await axios.get<TDto[]>(`${this.baseUrl}/all?${params}`);
    return response.data;
  }

  async getCount(filter?: string): Promise<number> {
    const params = new URLSearchParams();
    if (filter) params.append("dynamicFilter", filter);

    const response = await axios.get<number>(`${this.baseUrl}/count?${params}`);
    return response.data;
  }

  async create(dto: TDto): Promise<TDto> {
    const response = await axios.post<TDto>(this.baseUrl, dto);
    return response.data;
  }

  async update(dto: TDto): Promise<TDto> {
    const response = await axios.put<TDto>(this.baseUrl, dto);
    return response.data;
  }

  async delete(filter?: string): Promise<TDto[]> {
    const params = new URLSearchParams();
    if (filter) params.append("dynamicFilter", filter);

    const response = await axios.delete<TDto[]>(`${this.baseUrl}?${params}`);
    return response.data;
  }
}
