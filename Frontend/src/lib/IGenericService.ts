export interface IGenericService<TDto> {
    getAll(filter?: string, sortBy?: string, page?: number, pageSize?: number): Promise<TDto[]>;
    getCount(filter?: string): Promise<number>;
    create(dto: TDto): Promise<TDto>;
    update(dto: TDto): Promise<TDto>;
    delete(filter?: string): Promise<TDto[]>;
  }
  