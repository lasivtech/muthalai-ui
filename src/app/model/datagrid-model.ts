import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export class DataGridParams{
  displayedColumns:string[];
  serverApi:Function;
  initServerApi?:Function = null;
}

export class DataGridRequest {
  public pageRequest: PageRequestVo;
  public sortingRequest: SortingRequest;
  public andFilterMap: Object;

  constructor(
    matPaginator?: MatPaginator,
    matSort?: MatSort,
    andFilterMap?: Object
  ) {
    this.pageRequest = new PageRequestVo(matPaginator);
    this.sortingRequest = new SortingRequest(matSort);
    this.andFilterMap = andFilterMap;
  }
}

export class PageRequestVo {
  public currentPage: number;
  public itemsPerPage: number;

  constructor(matPaginator?: MatPaginator) {
    if (matPaginator != null) {
      this.currentPage = matPaginator.pageIndex;
      this.itemsPerPage = matPaginator.pageSize;
    }
  }
}

export class SortingRequest {
  public fieldName: string;
  public sortingOrder: string;

  constructor(matSort?: MatSort) {
    if (matSort != null) {
      this.fieldName = matSort.active;
      this.sortingOrder = matSort.direction;
    }
  }
}

export class DataGridResponse{
  public dataList:Array<any>;
  public totalRowsCount:number;
}